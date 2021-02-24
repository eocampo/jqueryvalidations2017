# jQuery Validations Reference Project

This repository provides reference about common uses of jQuery's Form Validation and the Extensions with Microsoft Unobstrusive Validation

## About Microsoft Unobstrusive Validation (MVC 3 Beta and MVC 4)

### What does mean "unobstrusive"?

"Unobstrusive" implementations does not pollute your source code with explicit calls to the supporting API but add HTML attributes to setup implicit handlers as extensions. This is done by making use of data- attributes in HTML.

For example in MVC 1.0 and 2.0 the ASP.NET Ajax library (Microsoft.Ajax.js) will render inline JavaScript on your <a> and <form> elements when you use the ActionLink, RouteLink or BeginForm and BeginRouteForm:
  
```Html
  <form
    action="/ajax/callback"
    id="form0"
    method="post"
    onclick="Sys.Mvc.AsyncForm.handleClick(this, new Sys.UI.DomEvent(event));"
    onsubmit="Sys.Mvc.AsyncForm.handleSubmit(this, new Sys.UI.DomEvent(event), { insertionMode: Sys.Mvc.InsertionMode.replace, loadingElementId: 'loading', updateTargetId: 'updateme' });">
```

When the "unobstrusive" technique was introduced in the MVC 3.0 beta the previous rendering now has the attribute injection:

```Html
<form
    action="/ajax/callback"
    data-ajax="true"
    data-ajax-loading="#loading"
    data-ajax-mode="replace"
    data-ajax-update="#updateme"
    method="post">
```

When does Unobstrusive Client Validation start in MVC?

In ASP.NET MVC 2 client- and server-side validation support was introduced. The client-side validation was a custom validation system written against ASP.NET Ajax, and an experimental versión written against jQuery. In the ASP.NET MVC 3 Beta the runtime introduced the Unobstrusive Client Validation for the first time. That implementation will introduce a consumer for these unobstrusive client validation attributes that uses jQuery and jQuery Validate libraries to perform the validation for the developer.

Before MVC 3 Beta the client-side validation was decoupled from the server-side validation system through the use of JSON. With a model like this:

```CSharp
public class ValidationModel {
    [Required]
    public string FirstName { get; set; }
    [Required, StringLength(60)]
    public string LastName { get; set; }
    [Range(1, 130)]
    public int Age { get; set; }
}
```

With client-side validation enabled, you get the following markup: (some unimportant HTML removed)

```Html
  <label for="FirstName">FirstName</label>
  <input class="text-box single-line" id="FirstName" name="FirstName" type="text" value="" />
  <span class="field-validation-valid" id="FirstName_validationMessage"></span>

  <label for="LastName">LastName</label>
  <input class="text-box single-line" id="LastName" name="LastName" type="text" value="" />
  <span class="field-validation-valid" id="LastName_validationMessage"></span>

  <label for="Age">Age</label>
  <input class="text-box single-line" id="Age" name="Age" type="text" value="" />
  <span class="field-validation-valid" id="Age_validationMessage"></span>

<script type="text/javascript">
//<![CDATA[
  if (!window.mvcClientValidationMetadata) { window.mvcClientValidationMetadata = []; }
  window.mvcClientValidationMetadata.push({"Fields":[{"FieldName":"FirstName","ReplaceValidationMessageContents":true,"ValidationMessageId":"FirstName_validationMessage","ValidationRules":[{"ErrorMessage":"The FirstName field is required.","ValidationParameters":{},"ValidationType":"required"}]},{"FieldName":"LastName","ReplaceValidationMessageContents":true,"ValidationMessageId":"LastName_validationMessage","ValidationRules":[{"ErrorMessage":"The LastName field is required.","ValidationParameters":{},"ValidationType":"required"},{"ErrorMessage":"The field LastName must be a string with a maximum length of 60.","ValidationParameters":{"max":60},"ValidationType":"length"}]},{"FieldName":"Age","ReplaceValidationMessageContents":true,"ValidationMessageId":"Age_validationMessage","ValidationRules":[{"ErrorMessage":"The field Age must be between 1 and 130.","ValidationParameters":{"min":1,"max":130},"ValidationType":"range"},{"ErrorMessage":"The Age field is required.","ValidationParameters":{},"ValidationType":"required"},{"ErrorMessage":"The field Age must be a number.","ValidationParameters":{},"ValidationType":"number"}]}],"FormId":"form0","ReplaceValidationSummary":true,"ValidationSummaryId":"validationSummary"});
//]]>
</script>
```
When unobtrusive Ajax mode is enabled in MVC, the HTML that we generate looks significantly different:

```Html
<label for="FirstName">FirstName</label>
<input class="text-box single-line" data-val="true" data-val-required="The FirstName field is required." id="FirstName" name="FirstName" type="text" value="" />
<span class="field-validation-valid" data-valmsg-for="FirstName" data-valmsg-replace="true"></span>

<label for="LastName">LastName</label>
<input class="text-box single-line" data-val="true" data-val-length="The field LastName must be a string with a maximum length of 60." data-val-length-max="60" data-val-required="The LastName field is required." id="LastName" name="LastName" type="text" value="" />
<span class="field-validation-valid" data-valmsg-for="LastName" data-valmsg-replace="true"></span>

<label for="Age">Age</label>
<input class="text-box single-line" data-val="true" data-val-number="The field Age must be a number." data-val-range="The field Age must be between 1 and 130." data-val-range-max="130" data-val-range-min="1" data-val-required="The Age field is required." id="Age" name="Age" type="text" value="" />
<span class="field-validation-valid" data-valmsg-for="Age" data-valmsg-replace="true"></span>
```

For each client validation rule, an attribute is added with data-val-rulename="message". If the validators wants to the use the default client-side validation message, you can leave the attribute value as an empty string. Then, for each parameter in the client validation rule, an attribute is added with data-val-rulename-paramname="paramvalue".

For each Html.ValidationMessage call, the generated <span> will have data-valmsg-for="inputname" and data-valmsg-replace="true/false" attached to it.

If you call Html.ValidationSummary, the generated <div> will have data-valmsg-summary="true" applied to it.

#### Bridging HTML and jQuery Validate: Adapters

Writing a client-side validator involves two steps: writing the validator for jQuery Validate, and writing the adapter which takes the parameter values from the HTML attributes and turns it into jQuery Validate metadata. The former topic is not in the scope of this blog post (since it’s really not MVC specific).

There is an adapter collection available at jQuery.validator.unobtrusive.adapters. Hanging off the adapter collection is the adapter registration method (add) and three helpers that can be used to register very common types of adapters (addBool, addSingleVal, and addMinMax).

#### Boolean validators

The most common form of validator in jQuery Validate is a boolean validator; that is, the only data the validator needs to know is whether it’s on or not. Examples of boolean validators in jQuery Validate include “creditcard”, “date”, “digits”, “email”, “number”, “required”, and “url”.

To automatically create an adapter for a boolean validator, you can call the following helper method:
 
```ECMAScript
jQuery.validator.unobtrusive.adapters.addBool(adapterName, [ruleName]);
```

**adapterName** is the name of the adapter, and matches the name of the rule in the HTML element.

**ruleName** is the name of the jQuery Validate rule, and is optional. If it's not provided, then the adapterName is used.
