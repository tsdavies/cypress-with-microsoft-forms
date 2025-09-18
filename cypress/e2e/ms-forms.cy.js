describe('Microsoft Form with Cypress?', () => {
    const URL =
        'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__gvGhuxURUJWU05KSEc0MFNNTEozTlFNV1EzVFZUUC4u';

    it('Does a bunch of manipulation of a form with different types', () => {
        cy.visit(URL);
        cy.contains('Start now', {timeout: 10000})
            .click({force: true});

        // Click a radio option inside Q1
        cy.findMSFormQuestion('Can I choose an option?')
            .contains('[data-automation-id="choiceItem"] label', "Yes")
            .click({force: true});

        // Type into the text box for Q2
        cy.findMSFormQuestion('Can I enter a textfield value?')
            .find('[data-automation-id="textInput"]')
            .type('Hello world');

        // Move options in an Option List for Q3
        cy.findMSFormQuestion('Can I manipulate an option list').within(() => {
            cy.contains('[data-automation-id="rankingItemContent"]', 'Option 2')
                .closest('[role="option"]')
                .as('opt2');

            cy.get('@opt2')
                .parent()
                .find('button[aria-label="Move option up"]:not([disabled])')
                .first()
                .scrollIntoView()
                .focus()
                .click({force: true});
        });

        // Add a date for Q4
        const value = "9/18/2025"
        cy.findMSFormQuestion('Can I use a datefield?')
            .find('[data-automation-id="dateContainer"] input[aria-label="Date picker"]')
            .as('dateInput')
            .scrollIntoView()
            .click()
            .type('{selectall}{backspace}')
            .type(value) // type M/D/YYYY - I know! It's an American format but that's not the test! :)
            .blur()
            .should('have.value', value)
            .and('have.attr', 'aria-invalid', 'false');

        // Clicks the Submit button
        cy.get('[data-automation-id="submitButton"]')
            .scrollIntoView()
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        // Form submitted check
        cy.get('#scrollable-root').scrollTo(0, 0);
        cy.get('[data-automation-id="submitButton"]').should('not.exist');
        cy.contains("Your response was submitted").should('be.visible');
    });
});
