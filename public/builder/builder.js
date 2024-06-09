// --- Builder ---

jQuery(($) => {
  "use strict";
  var $fbPages = $(document.getElementById("form-builder-pages"));
  var addPageTab = document.getElementById("add-page-tab");
  const API = window.__TAURI__;
  const fbInstances = {};
  let unlisten;

  async function init() {
    const slugs = await getSlugs();

    if (!slugs.length) {
      addPage('page-1');
    }

    for (const slug of slugs) {
      const content = await getPageData(slug);
      addPage(slug, content);
    }

    unlisten = await API.window.WebviewWindow.getByLabel('builder').onCloseRequested(async (event) => {
      try {
        await save(fbInstances);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    });
  }

  init();

  $fbPages.tabs({
    beforeActivate: function (event, ui) {
      if (ui.newPanel.selector === "#new-page") {
        return false;
      }
    }
  });

  $fbPages.on( "click", ".tab-close", function() {
    var tabId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
    $( "#" + tabId ).remove();
    delete fbInstances[tabId];
    $fbPages.tabs( "refresh" );
  });

  addPageTab.addEventListener(
    "click",
    (click) =>{
      const tabCount = document.getElementById("tabs").children.length;
      const tabId = "page-" + tabCount.toString();
      addPage(tabId);
    },
    false
  );

  $(document.getElementById("cancel-btn")).click(async function () {
    await API.window.WebviewWindow.getByLabel('builder').close();
  });

  $(document.getElementById("save-btn")).click(async function () {
    if (unlisten) unlisten();
    try {
      await save(fbInstances);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
    await API.window.WebviewWindow.getByLabel('builder').close();
  });

  function addPage(tabId, formData) {
    const tabCount = document.getElementById("tabs").children.length;
    const $newPageTemplate = document.getElementById("new-page");
    const $newTabTemplate = document.getElementById("add-page-tab");
    const $newPage = $newPageTemplate.cloneNode(true);
    $newPage.setAttribute("id", tabId);
    $newPage.classList.add("fb-editor");
    const $newTab = $newTabTemplate.cloneNode(true);
    $newTab.removeAttribute("id");
    $('<span class="tab-close" role="presentation">x</span>').appendTo($newTab);
    const $tabLink = $newTab.querySelector("a");
    $tabLink.setAttribute("href", "#" + tabId);
    $tabLink.innerText = "Page " + tabCount;

    $newPageTemplate.parentElement.insertBefore($newPage, $newPageTemplate);
    $newTabTemplate.parentElement.insertBefore($newTab, $newTabTemplate);
    $fbPages.tabs("refresh");
    $fbPages.tabs("option", "active", tabCount - 1);

    addBuilder(tabId, $newPage, formData);
  }

  function addBuilder(tabId, selector, formData) {
    fbInstances[tabId] = $(selector).formBuilder(
      {
        dataType: 'json',
        clobberingProtection: {
          document: true,
          form: true, //Set true for FormRender
          namespaceAttributes: true,
        },
        disabledAttrs: [
          'access',
          'className',
          'description',
          'inline',
          // 'label',
          'max',
          'maxlength',
          'min',
          // 'multiple',
          'name',
          // 'options',
          'other',
          'placeholder',
          'required',
          'rows',
          'step',
          'style',
          'subtype',
          'toggle',
          // 'value'
        ],
        disableFields: ['autocomplete', 'button', 'date', 'hidden', 'file', 'number', 'paragraph', 'starRating', 'text', 'textarea', 'select'],
        formData,
        replaceFields: [
          {
            type: "checkbox-group",
            label: "Multiple Response",
            values: [
              { label: "Response 1", value: "1" },
              { label: "Response 2", value: "2" },
              { label: "Response 3", value: "3" }
            ],
          },
          {
            type: "radio-group",
            label: "Multiple Choice",
            values: [
              { label: "Response 1", value: "1" },
              { label: "Response 2", value: "2" },
              { label: "Response 3", value: "3" }
            ],
          },

          // {
          //   type: "select",
          //   label: "Select",
          //   values: [
          //     { label: "Response 1", value: "1" },
          //     { label: "Response 2", value: "2" },
          //     { label: "Response 3", value: "3" }
          //   ],
          // },
          
        ],
        showActionButtons: false,
      }
    );
  }
});
