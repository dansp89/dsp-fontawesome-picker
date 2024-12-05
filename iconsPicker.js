(function ($) {
    const cdn_base = 'https://cdn.jsdelivr.net/gh/dansp89/dsp-fontawesome-picker@main';
    let iconList = null;

    // Default translation object in English
    const defaultTranslations = {
        openPicker: 'Open Picker',
        searchPlaceholder: 'Search icons...',
        noIconsFound: 'No icons found',
    };

    /**
     * Loads the icon list from a remote JSON source.
     * If the list has already been loaded, it returns a resolved promise.
     * 
     * @returns {Promise} Resolves when the icon list is successfully loaded or if already loaded.
     */
    function loadIconList() {
        if (iconList) {
            return Promise.resolve();
        }

        return fetch(cdn_base + '/v6.json')
            .then(response => response.json())
            .then(data => {
                iconList = data;
            })
            .catch(error => {
                console.error('Error loading JSON file:', error);
            });
    }

    /**
     * Adds the CSS file to the head of the document if not already added.
     */
    function addCSS() {
        if (!document.getElementById('iconpicker-style')) {
            const link = document.createElement('link');
            link.id = 'iconpicker-style';
            link.rel = 'stylesheet';
            link.href = cdn_base + '/style.min.css';
            document.head.appendChild(link);
        }
    }
    addCSS();

    /**
     * Initializes the icon picker plugin on the selected element.
     * The plugin provides functionality to pick an icon, search through icons,
     * and customize settings like closing behavior and icon selection callback.
     * 
     * @param {Object} options - Configuration options for the icon picker.
     * @param {Array} options.icons - Array of icon classes to display (optional, default is loaded from external source).
     * @param {string|null} options.defaultIcon - Default icon to be selected initially (optional).
     * @param {boolean} options.closeOnSelect - If true, the picker will close after an icon is selected (default: false).
     * @param {boolean} options.closeOnOutsideClick - If true, the picker will close when clicking outside the dropdown (default: true).
     * @param {Function} options.onIconSelect - Callback function that is triggered when an icon is selected (optional).
     * @param {Object} options.translate - Object for user-provided translations for UI text (optional).
     */
    $.fn.iconPicker = function (options = {}) {
        const settings = $.extend(
            {
                icons: iconList,
                defaultIcon: null,
                closeOnSelect: false,
                closeOnOutsideClick: true,
                onIconSelect: function (icon) { },
                translate: {}  // Custom translations for the UI
            },
            options
        );

        /**
         * Retrieves a translated text based on the provided key.
         * Fallbacks to the key if no translation is found.
         * 
         * @param {string} key - The translation key.
         * @returns {string} Translated string or the original key if not found.
         */
        function translate(key) {
            return settings.translate[key] || defaultTranslations[key] || key;
        }

        const instanceId = `iconpicker-${Math.random().toString(36).substr(2, 9)}`;
        const buttonClose = !settings.closeOnSelect && !settings.closeOnOutsideClick ? '<button class="iconpicker-close-btn" type="button"><i class="fa-classic fa-regular fa-circle-xmark"></i></button>' : '';

        // HTML structure for the icon picker
        const iconPickerHtml = `
        <div class="iconpicker-container" id="${instanceId}">
            <button class="iconpicker-toggle-btn" type="button">${settings.defaultIcon ? `<i class="${settings.defaultIcon}"></i>` : translate("openPicker")}</button>
            <div class="iconpicker-card-fa iconpicker-dropdown">
                ${buttonClose}
                <div class="iconpicker-card-fa-header">
                    <button class="iconpicker-card-fa-controls iconpicker-left" type="button">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <input
                        type="search"
                        class="iconpicker-search-box iconpicker-comp-input-fa"
                        placeholder="${translate("searchPlaceholder")}"
                    />
                    <button class="iconpicker-card-fa-controls iconpicker-right" type="button">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
                <div class="iconpicker-icon-grid"></div>
                <div class="iconpicker-public-class">
                    <input
                        class="iconpicker-comp-fa-class iconpicker-comp-input-fa selected-icon"
                        readonly
                    />
                </div>
            </div>
        </div>`;

        // Injects the HTML structure into the target element
        this.html(iconPickerHtml);

        const $container = $(`#${instanceId}`);
        const $toggleBtn = $container.find(".iconpicker-toggle-btn");
        const $dropdown = $container.find(".iconpicker-dropdown");
        const $iconGrid = $container.find(".iconpicker-icon-grid");
        const $searchBox = $container.find(".iconpicker-search-box");
        const $selectedIconInput = $container.find(".selected-icon");
        const $closeBtn = $container.find(".iconpicker-close-btn");

        const iconsPerPage = 25;
        let currentPage = 1;
        let filteredIcons = [];
        let selectedIcon = settings.defaultIcon;

        /**
         * Renders the icons in the picker.
         * It updates the icon grid to show the icons for the current page and filtered list.
         * 
         * @param {number} page - The page number to render. Defaults to 1.
         */
        function renderIcons(page = 1) {
            $iconGrid.empty();
            const start = (page - 1) * iconsPerPage;
            const end = start + iconsPerPage;
            const iconsToShow = filteredIcons.slice(start, end);

            if (iconsToShow.length === 0) {
                $iconGrid.html(`<p>${translate("noIconsFound")}</p>`);
                return;
            }

            iconsToShow.forEach((icon) => {
                const isSelected = icon === selectedIcon ? "selected" : "";
                $iconGrid.append(`
                    <div class="iconpicker-icon-item ${isSelected}" data-icon="${icon}">
                        <i class="${icon}"></i>
                    </div>
                `);
            });
        }

        // Event handler for the search input
        $searchBox.on("input", function () {
            const searchValue = $(this).val().toLowerCase();
            filteredIcons = iconList.filter((icon) =>
                icon.toLowerCase().includes(searchValue)
            );
            currentPage = 1;
            renderIcons(currentPage);
        });

        /**
         * Handles the selection of an icon from the grid.
         * Updates the selected icon, the displayed icon in the toggle button, and the input field.
         * 
         * @param {Event} event - The click event triggered by the icon item.
         */
        $iconGrid.on("click", ".iconpicker-icon-item", function () {
            $(".iconpicker-icon-item").removeClass("selected");
            $(this).addClass("selected");
            selectedIcon = $(this).data("icon");
            $selectedIconInput.val(selectedIcon);  // Update the input with the selected icon
            settings.onIconSelect(selectedIcon);
            $toggleBtn.html(`<i class="${selectedIcon}"></i>`);

            if (settings.closeOnSelect) {
                $dropdown.hide();
            }
        });

        // Event handlers for pagination
        $container.find(".iconpicker-left").click(function () {
            if (currentPage > 1) {
                currentPage--;
                renderIcons(currentPage);
            }
        });

        $container.find(".iconpicker-right").click(function () {
            const totalPages = Math.ceil(filteredIcons.length / iconsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderIcons(currentPage);
            }
        });

        // Toggle the visibility of the dropdown
        $toggleBtn.click(function () {
            $dropdown.toggle();
        });

        // Close the dropdown when the close button is clicked
        $closeBtn.click(function () {
            $dropdown.hide();
        });

        // Close the dropdown if clicked outside
        if (settings.closeOnOutsideClick) {
            $(document).on("click", function (event) {
                if (!$container.is(event.target) && $container.has(event.target).length === 0) {
                    $dropdown.hide();
                }
            });
        }

        // Load the icon list and initialize the icon picker
        loadIconList().then(() => {
            filteredIcons = iconList;
            // Check if the defaultIcon is valid before setting it
            if (settings.defaultIcon && iconList.includes(settings.defaultIcon)) {
                selectedIcon = settings.defaultIcon;
                $selectedIconInput.val(selectedIcon);  // Fill the input with the default icon
            }
            renderIcons(currentPage);
        });
    };
})(jQuery);
