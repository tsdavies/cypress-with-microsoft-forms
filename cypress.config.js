const {defineConfig} = require("cypress");

module.exports = defineConfig({
    e2e: {
        experimentalSessionAndOrigin: true,
        defaultCommandTimeout: 15000,
        includeShadowDom: true,       // MS Forms uses web components in places
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
