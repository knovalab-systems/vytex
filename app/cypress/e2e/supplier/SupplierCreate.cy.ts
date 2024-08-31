// SupplierCreate.cy
/// <reference types="cypress" />
import { fa, faker } from '@faker-js/faker';

describe('CreateSupplier test', () => {
	beforeEach(() => {
		cy.visit('http://localhost:4040/');
		cy.get('#username-field').clear();
		cy.get('#username-field').type('admin');
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type('password123');
		cy.get('.inline-flex').click();
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(4) > .flex > .ml-3').click();
		cy.get('.h-full > :nth-child(1) > .inactive > .inline-flex').click();
	});

	it('cv base case', () => {
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#brand-field').clear();
		cy.get('#brand-field').type(faker.company.name());
		cy.get('#code-field').clear();
		cy.get('#code-field').type(faker.string.numeric({ length: 5 }));
		cy.get('#nit-field').clear();
		cy.get('#nit-field').type(faker.string.numeric({ length: 9 }));

		cy.get('.bg-success').click();

		// await for the status message
		cy.get('[role="status"]').should('have.text', 'Proveedor creado correctamente');
	});

	// name
	it('ci name empty', () => {
		cy.get('#brand-field').clear();
		cy.get('#brand-field').type(faker.company.name());
		cy.get('#code-field').clear();
		cy.get('#code-field').type(faker.string.numeric({ length: 5 }));
		cy.get('#nit-field').clear();
		cy.get('#nit-field').type(faker.string.numeric({ length: 9 }));

		cy.get('.bg-success').click();

		cy.get('.text-red-600').should('have.text', 'Ingresa el nombre.');
	});

	// brand
	it('ci brand empty', () => {
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#code-field').clear();
		cy.get('#code-field').type(faker.string.numeric({ length: 5 }));
		cy.get('#nit-field').clear();
		cy.get('#nit-field').type(faker.string.numeric({ length: 9 }));

		cy.get('.bg-success').click();

		cy.get('.text-red-600').should('have.text', 'Ingresa la marca.');
	});

	// code
	it('ci code exists', () => {
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#brand-field').clear();
		cy.get('#brand-field').type(faker.company.name());
		cy.get('#code-field').type('12345');
		cy.get('#nit-field').clear();
		cy.get('#nit-field').type(faker.string.numeric({ length: 9 }));

		cy.get('.bg-success').click();

		cy.get('[role="status"]').should('have.text', 'El código "12345" no está disponible. Intente con otro.');
	});

	it('ci code empty', () => {
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#brand-field').clear();
		cy.get('#brand-field').type(faker.company.name());
		cy.get('#nit-field').clear();
		cy.get('#nit-field').type(faker.string.numeric({ length: 9 }));

		cy.get('.bg-success').click();

		cy.get('.text-red-600').should('have.text', 'Ingresa el código.');
	});

	// nit
	it('ci nit exists', () => {
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#brand-field').clear();
		cy.get('#brand-field').type(faker.company.name());
		cy.get('#code-field').clear();
		cy.get('#code-field').type(faker.string.numeric({ length: 5 }));
		cy.get('#nit-field').type('123456789');

		cy.get('.bg-success').click();

		cy.get('[role="status"]').should('have.text', 'El NIT "123456789" no está disponible. Intente con otro.');
	});

	it('ci nit empty', () => {
		cy.get('#name-field').type(faker.person.fullName());
		cy.get('#brand-field').clear();
		cy.get('#brand-field').type(faker.company.name());
		cy.get('#code-field').clear();
		cy.get('#code-field').type(faker.string.numeric({ length: 5 }));

		cy.get('.bg-success').click();

		cy.get('.text-red-600').should('have.text', 'Ingresa el NIT.');
	});
});
