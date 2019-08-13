<script>
const AceEditor = require('vue2-ace-editor');

export default {
  name: 'App',
  components: {
    AceEditor,
  },
  data: () => ({
    fileName: 'docker-compose.yml',
    baseText: '',
    text: '',
    editor: null,
    height: window.innerHeight - 50,
    editorOptions: {
      showInvisibles: true,
    },
  }),
  computed: {
    dirty() {
      return this.baseText !== this.text;
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
        @click="save"
        :style="{ backgroundColor: dirty ? 'dodgerblue' : 'gray' }"
      >
        Save
      </button>
    </div>
  </div>
</template>

<style>
.actions {
  margin-top: 10px;
}

.actions button {
  border: none;
  color: white;
  padding: 5px 8px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

.actions button:hover {
  cursor: pointer;
}

.actions button:active {
  transform: translateY(4px);
}
</style>
