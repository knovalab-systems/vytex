// CustomCreate.cy.ts
/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

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
		cy.get('.h-full > :nth-child(1) > .inactive > .inline-flex').click();
	});

	it('cv base case', () => {
		cy.get('#client-field').clear();
		cy.get('#client-field').type(faker.person.fullName());

		// select color
		cy.get('[aria-label=Referencias]')
			.eq(0)
			.within(() => {
				cy.get('[aria-label="Referencias"]').click();
			});
		cy.get('[role="option"]').eq(0).click();

		cy.get('span > .size-4').click();
		cy.get('.border-b > :nth-child(2) > .w-full').clear();
		cy.get('.border-b > :nth-child(2) > .w-full').type('1');
		cy.get('.\\[\\&_tr\\:last-child\\]\\:border-0 > .border-b > :nth-child(3)').click();
		cy.get('.border-b > :nth-child(3) > .w-full').clear();
		cy.get('.border-b > :nth-child(3) > .w-full').type('2');

		// // add order
		cy.get('.justify-end > .inline-flex').click();

		// select other color
		cy.get('[aria-label=Referencias]')
			.eq(2)
			.within(() => {
				cy.get('[aria-label="Referencias"]').click();
			});
		cy.get('[role="option"]').eq(2).click();

		cy.get(':nth-child(3) > .border-b > :nth-child(4) > .w-full').clear();
		cy.get(':nth-child(3) > .border-b > :nth-child(4) > .w-full').type('3');
		cy.get(':nth-child(3) > .border-b > :nth-child(4) > .w-full').clear();

		cy.get(':nth-child(3) > .border-b > :nth-child(4) > .w-full').type('4');
		cy.get(':nth-child(3) > .border-b > :nth-child(4) > .w-full').clear();
		cy.get(':nth-child(3) > .border-b > :nth-child(4) > .w-full').type('3');

		cy.get('.bg-success').click();
		cy.get('[role="status"]').should('have.text', 'Pedido creado correctamente.');
	});

	// client
	it('ci client empty', () => {
		cy.get('#client-field').clear();

		// select reference
		cy.get('[aria-label=Referencias]')
			.eq(0)
			.within(() => {
				cy.get('[aria-label="Referencias"]').click();
			});
		cy.get('[role="option"]').eq(0).click();

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'Ingrese el cliente.');
	});

	// refences
	it('ci references empty', () => {
		cy.get('#client-field').clear();
		cy.get('#client-field').type(faker.person.fullName());

		cy.get('.text-red-600').should('have.text', 'Seleccione una referencia.');

		cy.get('.bg-success').click();
	});

	// sizes
	it('ci sizes sizes equal 0', () => {
		cy.get('#client-field').clear();
		cy.get('#client-field').type(faker.person.fullName());

		// select color
		cy.get('[aria-label=Referencias]')
			.eq(0)
			.within(() => {
				cy.get('[aria-label="Referencias"]').click();
			});
		cy.get('[role="option"]').eq(0).click();

		cy.get('span > .size-4').click();
		cy.get('.border-b > :nth-child(2) > .w-full').clear();

		cy.get('.bg-success').click();
		cy.get('.text-red-600').should('have.text', 'Ingresa un valor igual o mayor a 0.');
	});

	it('ci sizes is empty', () => {
		cy.get('#client-field').clear();
		cy.get('#client-field').type(faker.person.fullName());

		// select color
		cy.get('[aria-label=Referencias]')
			.eq(0)
			.within(() => {
				cy.get('[aria-label="Referencias"]').click();
			});
		cy.get('[role="option"]').eq(0).click();

		cy.get('span > .size-4').click();

		cy.get('.bg-success').click();
		cy.get('[role="status"]').should(
			'have.text',
			'Cada referencia debe tener almenos una talla con un valor mayor a 0.',
		);
	});
});
