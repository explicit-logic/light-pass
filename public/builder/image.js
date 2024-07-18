"use strict";
/**
 * This file is part of the Media (Image,Video,Audio) Element for formBuilder.
 * https://github.com/lucasnetau/formBuilder-plugin-media
 */

if (!window.fbControls) { window.fbControls = []; }

window.fbControls.push(function media(controlClass) {
  const API = window.__TAURI__;
  const { convertFileSrc } = API;
  const { createDir, writeBinaryFile } = API.fs;
  const { join } = API.path;

  class controlMedia extends controlClass {
    /**
     * Load embedded Javascript
     */
    configure() {
      if (this.preview) {
        let changeHandler = this.defaultChangeHandler;
        if ((this.classConfig.default_change_handler ?? true) === false) {
          changeHandler = undefined;
        }
        if (typeof this.classConfig.change_handler === 'function') {
          changeHandler = this.classConfig.change_handler
        }
        if (changeHandler) {
          const fieldId = this.id.replace(/-preview$/, "")
          const marker = `controlMediaEmbedded-${fieldId}`;
          const cache = window.fbLoaded.js; //Reuse the FormBuilder cache to ensure we only load the media control JS once
          if (!cache.includes(marker)) {
            const input = $(`input[value="${fieldId}"]`).closest('.form-elements').find('input[name="media-file-upload"]');
            $(input).on('change', changeHandler)
            cache.push(marker);
          }
        }
      }
    }

    defaultChangeHandler(event) {
      const input = $(event.target);
      const $container = input.closest('.form-elements'); //The container for an element's configuration fields
      const $src = $container.find('.fld-src');
      const file = input[0].files[0];
      try {
        validateFile(file);
      } catch (error) {
        alert(error.message);
        console.error(error);
        input.val("");
        return false;
      }

      const fileName = generateFileName(file.name);
      $container.find('.fld-mimetype').val(file.type);
      $container.find('.fld-size').val(file.size);

      getAsByteArray(file)
        .then(async (byteFile) => {
          const basePathParts = await getBasePathParts();
          const slug = getActiveSlug();
          const directoryPath = await join(...basePathParts, slug);
          await createDir(directoryPath, { recursive: true });
          const filePath = await join(...basePathParts, slug, fileName);
          await writeBinaryFile(filePath, byteFile);

          $src.val(fileName).trigger('change');
          input.val("");
        });

      // lastModified: 1720355319000
      // name: "1.png"
      // size: 505472
      // type: "image/png"
    }

    /**
     * Class configuration - return the icons & label related to this control
     * @return {object} definition
     */
    static get definition() {
      return {
        icon: '🖼️',
        i18n: {
          default: 'Image',
        },
        defaultAttrs: {
          'media-file-upload': {
            label: "",
            value: '',
            type: 'file',
            description: 'Upload an image file',
            accept: "image/jpg,image/jpeg,image/png",
          },
          // 'label': {
          //   label: "",
          //   value: '',
          //   type: 'text',
          // },
          'src': {
            label: "Filename",
            value: '',
            type: 'text',
            readonly: true,
          },
          'mimetype': {
            label: "Mime Type",
            value: '',
            type: 'text',
            description: 'Mimetype of Media',
            readonly: true,
          },
          'size': {
            // label: "Size",
            value: '',
            type: 'text',
            readonly: true,
          },
        },
        disabledAttrs: [
          // 'label',
          'value',
          'description',
          'placeholder',
        ],
      };
    }

    /**
     * Build the HTML5 attribute for the specified media type
     * @return {Object} DOM Element to be injected into the form.
     */
    build() {
      const { src, ...attrs } = this.config;

      attrs.width = 200;
      attrs.src = './img/placeholder.svg';

      delete (attrs.type);

      const img = this.markup('img', this.label, attrs);

      if (src) {
        setTimeout(() => {
          getFileUrl(src).then((url) => url ? img.src = url : false);
        }, 100);
      }

      return img;
    }

    /**
     * onRender callback
     */
    onRender() {}
  }

  async function getFileUrl(fileName) {
    const basePathParts = await getBasePathParts();
    const slug = getActiveSlug();
    if (!slug) return;
    const filePath = await join(...basePathParts, slug, fileName);
    const fileUrl = convertFileSrc(filePath);

    return fileUrl;
  }

  function getActiveSlug() {
    return $('.ui-tabs-active').attr("aria-controls");
  }

  async function getAsByteArray(file) {
    return new Uint8Array(await readFile(file))
  }

  function readFile(file) {
    return new Promise((resolve, reject) => {
      // Create file reader
      let reader = new FileReader()
  
      // Register event listeners
      reader.addEventListener("loadend", e => resolve(e.target.result))
      reader.addEventListener("error", reject)
  
      // Read file
      reader.readAsArrayBuffer(file)
    })
  }

  function generateFileName(originalName) {
    const extension = originalName.split('.').pop().toLowerCase();
    const name = generateUID();

    return `${name}.${extension.toLowerCase()}`;
  }

  function generateUID() {
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);

    return firstPart + secondPart;
  }

  function validateFile(file) {
    const maxSizeMB = 1;
    const maxSize = maxSizeMB * 1024 * 1024;

    const acceptedTypes = ['png', 'jpg', 'jpeg'];
    const acceptedTypesLong = ['image/png', 'image/jpg', 'image/jpeg'];

    const nameExtension = file.name.split('.').pop().toLowerCase();

    if (!acceptedTypes.includes(nameExtension)) {
      throw new Error(`Accepted file types: ${acceptedTypes.join(', ')}`);
    }

    if(!acceptedTypesLong.includes(file.type)) {
      throw new Error(`Accepted file types: ${acceptedTypes.join(', ')}`);
    }

    if (file.size > maxSize) {
      throw new Error(`Max file size ${maxSizeMB}MB allowed`);
    }
  }

  // register this control for the following types & text subtypes
  controlClass.register('image', controlMedia);

  // controlClass.register('media', controlMedia);
  // controlClass.register(['image'], controlMedia, 'media');

  return controlMedia;
});
