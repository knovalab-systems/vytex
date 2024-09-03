// SupplierUpdate.cy
/// <reference types="cypress" />
import { fa, faker } from '@faker-js/faker';

describe('UpdateSupplier test', () => {
	beforeEach(() => {
		cy.visit(Cypress.env('login'));
		cy.get('#username-field').clear();
		cy.get('#username-field').type('admin');
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type('password123');
		cy.get('.inline-flex').click();
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(4) > .flex > .ml-3').click();
		cy.get('.h-full > :nth-child(1) > .inactive > .inline-flex').click();
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(4) > .flex > .ml-3').click();
		cy.get(':nth-child(1) > :nth-child(7) > .flex > .inactive > .items-center > svg').click();
	});

	it('cv base case', () => {
		cy.get('#name-field').clear();
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#brand-field').clear();
		cy.get('#brand-field').type(faker.company.name());
		cy.get('#code-field').clear();
		cy.get('#code-field').type(faker.string.numeric({ length: 5 }));
		cy.get('#nit-field').clear();
		cy.get('#nit-field').type(faker.string.numeric({ length: 9 }));

		cy.get('.bg-success').click();

		// await for the status message
		cy.get('[role="status"]').should('have.text', 'Proveedor actualizado correctamente.');
	});

	// name
	it('ci name empty', () => {
		cy.get('#name-field').clear();
		cy.get('.bg-success').click();

		cy.get('.text-red-600').should('have.text', 'Ingresa el nombre.');
	});

	// brand
	it('ci brand empty', () => {
		cy.get('#brand-field').clear();
		cy.get('.bg-success').click();

		cy.get('.text-red-600').should('have.text', 'Ingresa la marca.');
	});

	// code
	it('ci code exists', () => {
		cy.get('#code-field').clear();
		cy.get('#code-field').type('12345');
		cy.get('.bg-success').click();

		cy.get('[role="status"]').should('have.text', 'El código "12345" no está disponible. Intente con otro.');
	});

	it('ci code empty', () => {
		cy.get('#code-field').clear();
		cy.get('.bg-success').click();

		cy.get('.text-red-600').should('have.text', 'Ingresa el código.');
	});

	// nit

	it('ci nit exists', () => {
		cy.get('#nit-field').clear();
		cy.get('#nit-field').type('123456789');
		cy.get('.bg-success').click();

		cy.get('[role="status"]').should('have.text', 'El NIT "123456789" no está disponible. Intente con otro.');
	});

	it('ci nit less than 9', () => {
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#brand-field').clear();
		cy.get('#brand-field').type(faker.company.name());
		cy.get('#code-field').clear();
		cy.get('#code-field').type(faker.string.numeric({ length: 5 }));
		cy.get('#nit-field').type(faker.string.numeric({ length: 8 }));

		cy.get('.bg-success').click();

		cy.get('.text-red-600').should('have.text', 'El NIT debe ser de 9 dígitos.');
	});

	it('ci nit more than 9', () => {
		cy.get('#nit-field').clear();
		cy.get('#nit-field').type(faker.string.numeric({ length: 10 }));

		cy.get('.bg-success').click();

		cy.get('.text-red-600').should('have.text', 'El NIT debe ser de 9 dígitos.');
	});

	it('ci nit less than 9', () => {
		cy.get('#nit-field').clear();
		cy.get('#nit-field').type(faker.string.numeric({ length: 8 }));

		cy.get('.bg-success').click();

		cy.get('.text-red-600').should('have.text', 'El NIT debe ser de 9 dígitos.');
	});

	it('ci nit empty', () => {
		cy.get('#nit-field').clear();
		cy.get('.bg-success').click();

		cy.get('.text-red-600').should('have.text', 'Ingresa el NIT.');
	});

	// status
	it('ci not select status', () => {
		cy.get('[aria-label=Estado]').click();

		// deselect the selected status
		cy.get('[role="option"][aria-selected="true"]').click();
		cy.get('.bg-success').click();

		cy.get('.my-auto').should('have.text', 'Selecciona un estado.');
	});
});
