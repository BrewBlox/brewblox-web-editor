<script>
const AceEditor = require('vue2-ace-editor');
import composeSchema from './compose-schema.json';
import jsonschema from 'jsonschema';
import yaml from 'js-yaml';

export default {
  name: 'App',
  components: {
    AceEditor,
  },
  data: () => ({
    fileName: 'docker-compose.yml',
    baseText: '',
    text: '',
    validator: new jsonschema.Validator(),
    validateError: null,
    editor: null,
    height: window.innerHeight - 100,
    editorOptions: {
      showInvisibles: true,
    },
  }),
  computed: {
    dirty() {
      return this.baseText !== this.text;
    },
  },
  watch: {
    text(newText) {
      try {
        const doc = yaml.safeLoad(newText);
        this.validator.validate(doc, composeSchema, { throwError: true });
        this.validateError = null;
      } catch (e) {
        this.validateError = e.message;
      }
    },
  },
  async created() {
    const resp = await fetch(`/_load/${this.fileName}`);
    this.baseText = await resp.text();
    this.text = this.baseText;
  },
  methods: {
    initEditor(editor) {
      require('brace/mode/yaml');
      require('brace/theme/chrome');
      require('brace/theme/github');
    },
    save() {
      const sent = this.text;
      fetch(`/_save/${this.fileName}`, {
        method: 'POST',
        body: sent,
        headers: new Headers({
          'Content-Type': 'text/plain',
        }),
      })
        .then(resp => {
          if (resp.ok) {
            this.baseText = sent;
          }
        });
    },
  },
};
</script>

<template>
  <div id="app">
    <AceEditor
      v-model="text"
      @init="initEditor"
      :height="height"
      :options="editorOptions"
      lang="yaml"
      theme="github"
    />
    <div class="actions">
      <button
        :disabled="!!validateError"
        @click="save"
        :style="{
          backgroundColor: dirty && !validateError ? 'dodgerblue' : ''
        }"
      >
        Save
      </button>
      <div v-if="!!validateError" style="color: red">
        Validation error:
        <br />
        {{ validateError }}
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: "Arial, Helvetica, sans-serif";
}

.actions {
  margin-top: 10px;
  display: flex;
}

.actions button {
  border: none;
  color: white;
  padding: 5px 8px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-right: 5px;
}

.actions button:disabled {
  cursor: not-allowed;
}

.actions button:active {
  transform: translateY(4px);
}
</style>
