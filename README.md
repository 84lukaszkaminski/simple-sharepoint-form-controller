# simple-sharepoint-form-controller
A simple SharePoint 2013 form wrapper which provides basic methods to manipulate a standard form field. It’s built with plain JavaScript. jQuery nor other heavy libraries are not needed.
The library operates only on front-end. SP data and spContext are not used.

## Form methods:
* getField(internalName)
* getFieldByTitle(title)
* getAllFields()
* getAllFieldsHashTable()
## Fields methods:
* getInternalName()
* getTitle()
* getFieldType()
* setLabel(string)
* show()
* hide()
* enable()
* disable()
* setValue(value)
* getValue()
* on(eventName, function) // now only implement "change" event
* off(eventName, function)
* trigger(eventName) 
* addClass(className)
* removeClass(className)
Lookups and choice fields also implement:
* getItems()
* setFilter(filterFunction)
* updateFilter()

## Supported SP fields:
* SPFieldText
* SPFieldNumber
* SPFieldCurrency
* SPFieldDateTime
* SPFieldLookup
* SPFieldLookupMulti
* SPFieldUser
* SPFieldUserMulti
* SPFieldChoice
* SPFieldOutcomeChoice
* SPFieldMultiChoice
* SPFieldBoolean
* SPFieldURL

## Dependencies:
* [moment](https://momentjs.com/) (included in project libs)

## Usage:
* Upload libs/moment.min.js, src/simpleSharepointFormController.min.css and src/simpleSharepointFormController.min.js and your appliction js file to SharePoint (e.g. /SiteAssets/SimpleSharepointFormController/...).
* Insert following html to a content editor or direct into aspx page at your New, Edit or Upload form.

```html
<link rel="stylesheet" href="/SiteAssets/SimpleSharepointFormController/styles.min.css"></link>
<script src="/SiteAssets/SimpleSharepointFormController/libs/moment.min.js"></script>
<script src="/SiteAssets/SimpleSharepointFormController/simplesharepointformcontroller.min.js"></script>
<script src="/SiteAssets/SimpleSharepointFormController/app.js"></script>
```

## Code your application:
```javascript
window.simpleSharePointFormController.use(['form'], function (formModule) {
    'use strict';

    var form, fields;

    form = formModule.createForm({
        customization: {
            dateFormat: 'YYYY-MM-DD',
            dateTimeFormat: 'YYYY-MM-DD HH:mm'
        }
    });

    form.on('ready', function () {
        fields = form.getAllFieldsHashTable();

        fields.Title.disable();
        fields.Title.setValue('new title');
        fields.Title.addClass('your-css-class');

        fields.SomeBooleanField.setValue(fields.getField('Title') == fields.getFieldByTitle('Display title'));

        fields.SomeLookupField.setValue(1);
        fields.SomeLookupField.setValue('or lookup value');

        fields.SomeLookupMultiField.setValue([1, 2, 3]);
        fields.SomeLookupMultiField.setValue(['or lookup value #1', 'lookup value #2', 'lookup value #3']);

        fields.SomeLookupOrMultiField.setFilter(function (lookupValue) { // every lookup item is evaluated with function
            return lookupValue.getId() < fields.SomeNumberField.getValue();
        });
        fields.SomeLookupOrMultiField.updateFilter(); // update filter on demand
        fields.SomeNumberField.on('change', function () {
            fields.SomeLookupOrMultiField.updateFilter(); // or do it automatically on related field value changed
        });
        
        [fields.SomeBooleanField, fields.SomeNumberField].forEach(function (oneField) {
            oneField.on('change', function () {
                if (fields.SomeBooleanField.getValue() && fields.SomeNumberField.getValue() > 10) {
                    fields.SomeOtherField.disable();
                } else {
                    fields.SomeOtherField.enable();
                }
            });
        });
        fields.SomeBooleanField.trigger('change');
    });

});
```

Tested with Chrome, Firefox, Edge, InternetExplorer 9+

## Hints
* every field value is nullable; null is only one _empty value_ which is fully supported
```javascript
// use
fields.WhatheverField.setValue(null);
// not
fields.WhatheverField.setValue();
fields.WhatheverField.setValue('');
fields.WhatheverField.setValue(undefined);

// be aware
fields.SomeLookupMulti.setValue(null);
fields.SomeLookupMulti.getValue() != []; // == null
```
* avoid passing "string-typed" values to fields
* lookups also take an object with the interface getId() as a value
```javascript
var lookupValue = { getId: function ( return 1; ), getValue: function() { return 'some text'; } }
fields.SomeLookup.setValue(lookupValue);
// or more useful
var lookupItems = fields.SomeLookupMultiField.getItems(); // an array of getId() getValue() objects
fields.SomeLookupMultiField.setValue([ lookupItems[0], lookupItems[lookupItems.length - 1] ]);
```
