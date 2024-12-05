# DSP FontAwesome 6 - Icons Picker

## Overview

The DSP FontAwesome V6 Icon Picker is a lightweight jQuery plugin that allows users to select an icon from the FontAwesome 6 collection. The picker provides a user-friendly interface for searching and selecting icons. It integrates FontAwesome icons in a clean, easy-to-use format, supporting custom options like default icon selection, search functionality, and more.

The plugin loads FontAwesome icons dynamically from a remote JSON file, ensuring that it is always up-to-date with the latest available icons.

## Features

- **Icon Picker Interface**: A responsive, searchable icon picker interface.
- **FontAwesome Integration**: Uses FontAwesome 6 for a broad selection of icons.
- **Customizable**: Support for setting default icons, icon search, custom translations, and more.
- **CSS Integration**: Automatically adds required CSS to the document.
- **Multiple Customization Options**: Close-on-select behavior, close-on-outside-click, and more.

## Installation

1. **Include jQuery**  
   Ensure that you have jQuery included in your project. If it's not already added, you can include it using the following CDN:

   ```html
   <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
   ```

2. **Include the Plugin**  
   The inclusion of these CDNs is already automatically included.

   ```html
   <script src="https://cdn.jsdelivr.net/gh/dansp89/dsp-fontawesome-picker@main/iconsPicker.min.js"></script>
   <link id="iconpicker-style" rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dansp89/dsp-fontawesome-picker@main/style.min.css" />
   ```

## Usage

### Basic Example

[VIEW DEMO](https://dansp89.github.io/dsp-fontawesome-picker/)

To use the icon picker, simply call the `.iconPicker()` function on any DOM element, like so:

```html
<div id="icon-picker"></div>

<script>
  $(document).ready(function() {
    $('#icon-picker').iconPicker();
  });
</script>
```

This will render the icon picker inside the element with the `id="icon-picker"`.

### Configuration Options

You can customize the icon picker behavior using the following options:

```javascript
$('#icon-picker').iconPicker({
  icons: [],                // Custom list of icons to display (optional, default is loaded from external source)
  defaultIcon: null,        // The icon to be pre-selected (optional)
  closeOnSelect: false,     // If true, the picker will close when an icon is selected (default: false)
  closeOnOutsideClick: true,// If true, the picker will close when clicking outside the picker (default: true)
  onIconSelect: function(icon) { // Callback function when an icon is selected
    console.log("Icon selected: " + icon);
  },
  translate: {}             // Custom translations for UI text (optional)
});
```

### Option Details

- `icons`: An array of FontAwesome icon classes to display in the picker. If not provided, it will fetch the icon list from the remote JSON source.
  
- `defaultIcon`: The FontAwesome class of the default icon to be pre-selected when the picker is initialized.

- `closeOnSelect`: If set to `true`, the picker will automatically close after an icon is selected. The default value is `false`.

- `closeOnOutsideClick`: If set to `true`, clicking outside the picker will close it. The default value is `true`.

- `onIconSelect`: A callback function that is triggered when an icon is selected. The selected icon class is passed as an argument to this function.

- `translate`: A dictionary object where you can provide translations for UI text (e.g., search placeholders, button text). If not provided, the default English text is used.

### Example with Custom Options

```html
<div id="icon-picker"></div>

<script>
  $(document).ready(function() {
    $('#icon-picker').iconPicker({
      defaultIcon: "fa-solid fa-heart",
      closeOnSelect: true,
      onIconSelect: function(icon) {
        console.log("Selected icon: " + icon);
        // You can update other elements or perform actions here
      },
      translate: {
        "openPicker": "Select an Icon",
        "searchPlaceholder": "Search Icons"
      }
    });
  });
</script>
```

### Selecting an Icon

Once initialized, the icon picker allows users to select an icon from the grid of available icons. Clicking on an icon will:

- Update the selected icon on the picker button.
- Populate the corresponding input field with the selected icon class.
- Trigger the `onIconSelect` callback function, passing the selected icon as an argument.

### Search Functionality

The picker includes a search box where users can type to filter the icons. This search filters icons based on their class name, and the grid will update dynamically to show matching results.

### Navigation

The icon grid is paginated to handle large numbers of icons efficiently. You can navigate through the pages using the left and right arrows in the header of the picker.

### CSS Integration

The required CSS is automatically added to the `<head>` of the document if not already present. The CSS file is loaded from the following URL:

```
https://cdn.jsdelivr.net/gh/dansp89/dsp-fontawesome-picker@main/style.min.css
```

### Customizing UI Text

You can provide your own translations for the UI text. For example, the text in the search input box or the placeholder text in the icon picker can be customized using the `translate` option:

```javascript
translate: {
  "openPicker": "Choose Icon",
  "searchPlaceholder": "Search for an icon..."
}
```

This will replace the default text with your custom translations.

## Events

The picker provides a callback function `onIconSelect` that is triggered whenever an icon is selected. You can use this to perform actions based on the selected icon.

### Example of `onIconSelect`:

```javascript
onIconSelect: function(icon) {
  // Update some DOM element with the selected icon
  $('#selected-icon').text(icon);
}
```

## Dependencies

- **jQuery**: The plugin requires jQuery to function correctly. Make sure jQuery is included in your project before using the plugin.

## License

This plugin is released under the MIT License. See the LICENSE file for more information.
```
