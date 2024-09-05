// CustomCreate.cy.ts
/// <reference types="cypress" />

describe('CustomCreate test', () => {
	beforeEach(() => {
		// login
		cy.visit(Cypress.env('login'));
		cy.get('#username-field').type(Cypress.env('ADMIN_USER'));
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type(Cypress.env('ADMIN_PASSWORD'));
		cy.get('.inline-flex').click();

		cy.wait(100);
		// go to customs create
		cy.visit('customs');

		cy.get(':nth-child(1) > :nth-child(6) > .flex > .inactive > .items-center').click();
		cy.get('span > .size-4').click();
	});

	it('cv base case', () => {
		// select reference
		cy.get('[aria-label=Referencias]').eq(0).click();
		cy.get('[role="option"]').eq(0).click();

		cy.get('.border-b > :nth-child(2) > .w-full').clear();
		cy.get('.border-b > :nth-child(2) > .w-full').type('2');
		cy.get('.border-b > :nth-child(3) > .w-full').clear();
		cy.get('.border-b > :nth-child(3) > .w-full').type('3');
		cy.get('.border-b > :nth-child(4) > .w-full').clear();
		cy.get('.border-b > :nth-child(4) > .w-full').type('40');

		cy.get('.bg-success').click();
		cy.get('[role="status"]').should('have.text', 'Orden creada exitosamente.');
	});

	// refences
	it('ci references empty', () => {
		cy.get('.bg-success').click();

		cy.get('.text-red-600').should('have.text', 'Seleccione una referencia.');
	});

	// sizes
	it('ci sizes equal 0', () => {
		// select reference
		cy.get('[aria-label=Referencias]').eq(0).click();
		cy.get('[role="option"]').eq(0).click();

		cy.get('.bg-success').click();
		cy.get('[role="status"]').should(
			'have.text',
			'Cada referencia debe tener almenos una talla con un valor mayor a 0.',
		);
	});

	it('ci sizes empty', () => {
		// select reference
		cy.get('[aria-label=Referencias]').eq(0).click();
		cy.get('[role="option"]').eq(0).click();

		cy.get('.border-b > :nth-child(2) > .w-full').clear();

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'Ingresa un valor igual o mayor a 0.');
	});
});
