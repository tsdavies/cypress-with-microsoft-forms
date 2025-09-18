// Finds the MS Forms "questionItem" by its visible question title text.
// Accepts a string or RegExp. Returns the <div data-automation-id="questionItem">.
Cypress.Commands.add('findMSFormQuestion', function findMSFormQuestion(titleOrRe) {
    const titleSelector = '[data-automation-id="questionTitle"] .text-format-content';
    const itemSelector = '[data-automation-id="questionItem"]';
    const matcher = titleOrRe instanceof RegExp ? titleOrRe : new RegExp(titleOrRe, 'i');

    return cy
        .contains(titleSelector, matcher, {timeout: 10000})
        .closest(itemSelector)
        .should('exist');
});

Cypress.Commands.add('moveOptionListItem', function moveOptionListItem(label, direction = 'up', times = 1) {
    const dir = String(direction).toLowerCase().includes('down') ? 'down' : 'up';
    const btnSelector = `button[aria-label="Move option ${dir}"]:not([disabled])`;
    const delta = dir === 'up' ? -1 : 1;

    return moveNTimes(times);

    // --- helpers (declared, not expressions) ---

    function readIndex() {
        return cy
            .get('[role="option"] [data-automation-id="rankingItemContent"]')
            .then(function ($items) {
                const texts = Array.from($items, function (el) {
                    return el.textContent.trim();
                });
                return texts.indexOf(label);
            });
    }

    function clickOnce() {
        cy.contains('[data-automation-id="rankingItemContent"]', label)
            .closest('[role="option"]')
            .then(function ($row) {
                cy.wrap($row)
                    .parent()
                    .find(btnSelector)
                    .first()
                    .scrollIntoView()
                    .focus()
                    .trigger('mouseover')
                    .click({force: true});
                // If CI is still racy, you can add: cy.wait(40)
            });
    }

    function moveNTimes(n) {
        if (n <= 0) return cy.wrap(null);

        return readIndex().then(function (before) {
            const target = before + delta;
            clickOnce();

            // Wait/retry until index reflects the move, then recurse
            return readIndex()
                .should('eq', target)
                .then(function () {
                    return moveNTimes(n - 1);
                });
        });
    }
});

Cypress.Commands.add('assertOptionListOrder', function assertOptionListOrder() {
    const expectedLabels = Array.prototype.slice.call(arguments);

    return cy
        .get('[role="option"] [data-automation-id="rankingItemContent"]')
        .then(function ($items) {
            const texts = Array.from($items, function (el) {
                return el.textContent.trim();
            });
            return texts;
        })
        .should('deep.equal', expectedLabels);
});
