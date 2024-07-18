// --- Builder ---
"use strict";

jQuery(($) => {
  const $root = $(document.getElementById("root"));
  const API = window.__TAURI__;
  let unlisten;

  const fbInstance = $('#fb-editor').formBuilder(
    {
      dataType: 'json',
      editOnAdd: true,
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
      disableFields: ['autocomplete', 'button', 'date', 'hidden', 'file', 'number', 'starRating', 'text', 'textarea', 'select'],
      formData: undefined,
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
      disableHTMLLabels: true,
      disabledFieldButtons: {
        image: ['edit'],
      }
    }
  );

  async function init() {
    const pagesConfig = await loadPagesConfig();
    const slugs = await getSlugs();
    const len = slugs.length;
    let activeIndex = 0;
    if (!len) {
      const pageId = increaseSequence();
      createTab(getSlug(pageId));
    } else {
      
      for (let i = 0; i < len; i++) {
        const slug = slugs[i];
        createTab(slug);

        if (slug === pagesConfig.active) {
          activeIndex = i;
        }
      }

      const [firstSlug] = slugs;
      const content = await getPageData(firstSlug);
      fbInstance.actions.setData(content.formData);
    }

    unlisten = await API.window.WebviewWindow.getByLabel('builder').onCloseRequested(onClose);

    $root.tabs({
      beforeActivate(event, ui) {
        const newSlug = ui.newPanel.prop('id');
        const oldSlug = ui.oldPanel?.prop('id');

        if (newSlug === "new-page") {
          return false;
        }
        const formData = JSON.parse(fbInstance.actions.getData('json'));

        const loadNewTab = () => getPageData(newSlug)
          .then((content) => {
            if (content && content.formData) {
              fbInstance.actions.setData(content.formData);
            } else {
              fbInstance.actions.clearFields();
            }
          })
          .catch(() => {
            fbInstance.actions.clearFields();
          });

        if (oldSlug) {
          return savePage(oldSlug, formData).then(loadNewTab);
        }

        return loadNewTab();
      },
    });
  
    $root.on( "click", ".tab-close", closeTab);

    $root.tabs("option", "active", activeIndex);
  }

  init();

  function openNewTab() {
    const tabCount = document.getElementById("tabs").children.length;
    const sequence = increaseSequence();
    createTab(getSlug(sequence));

    $root.tabs("refresh");
    $root.tabs("option", "active", tabCount - 1);
  }

  async function closeTab() {
    const $item = $( this ).closest( "li" );
    const slug = $item.attr( "aria-controls" );
    const active = getActiveSlug();
    await removePage(slug);

    $item.remove();
    $( "#" + slug ).remove();

    const $links = $('#tabs').find('a');
    const size = $links.length;
    $('#tabs').find('a').each(function(i) {
      const $this = $(this);
      const n = i + 1;

      if (n === size) {
        return false;
      }

      $this.text(`Page ${n}`);
    });

    if (active === slug) {
      $root.tabs("refresh");
      $root.tabs("option", "active", 0);
    } else if (!$root.tabs("option", "active")) {
      const tabCount = document.getElementById("tabs").children.length;
      $root.tabs("refresh");
      $root.tabs("option", "active", tabCount - 1);
    }
  }

  const addTabItem = document.getElementById("add-tab");
  addTabItem.addEventListener("click", openNewTab, false);

  function createTab(slug) {
    const tabCount = document.getElementById("tabs").children.length;
    const newTabItem = addTabItem.cloneNode(true);
    newTabItem.removeAttribute("id");
    $('<span class="tab-close" role="presentation">x</span>').appendTo(newTabItem);
    const newTabLink = newTabItem.querySelector("a");
    newTabLink.setAttribute("href", `#${slug}`);
    newTabLink.innerText = "Page " + tabCount;

    addTabItem.parentElement.insertBefore(newTabItem, addTabItem);

    const newPageTemplate = document.getElementById("new-page");
    const newPage = newPageTemplate.cloneNode(true);
    newPage.setAttribute("id", slug);
    newPageTemplate.parentElement.insertBefore(newPage, newPageTemplate);
  }


  $(document.getElementById("save-btn")).click(async function () {
    if (unlisten) unlisten();
    onClose();
    await API.window.WebviewWindow.getByLabel('builder').close();
  });

  function getActiveSlug() {
    return $('.ui-tabs-active').attr("aria-controls");
  }

  async function onClose() {
    try {
      const active = getActiveSlug();
      if (active) {
        await savePage(active, fbInstance.actions.getData());
      }
      await savePagesConfig(active);
      await updateQuestionCounter();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  function getSlug(pageId) {
    return `page-${pageId}`;
  }
});
