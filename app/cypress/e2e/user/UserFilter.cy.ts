// UserFilter.cy
/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('UserFilter test', () => {
	beforeEach(() => {
		// login
		cy.visit(Cypress.env('login'));
		cy.get('#username-field').type(Cypress.env('ADMIN_USER'));
		cy.get('#pass-field').clear();
		cy.get('#pass-field').type(Cypress.env('ADMIN_PASSWORD'));
		cy.get('.inline-flex').click();

		// go to users
		cy.get('.w-1\\/8 > .space-y-2 > :nth-child(2) > .flex > .ml-3').click();
	});

	//  username
	it('cv username exist in db', () => {
		cy.get('.w-52').clear();
		cy.get('.w-52').type('admin');
		cy.get('.\\[\\&_tr\\:last-child\\]\\:border-0 > :nth-child(1) > :nth-child(2)').should('have.text', 'admin');
	});

	it('ci username not exist in db', () => {
		cy.get('.w-52').clear();
		cy.get('.w-52').type(faker.internet.userName());

		cy.get('.border-b > .p-4').should('have.text', 'No se han encontrado usuarios.');
	});

	// name
	it('cv name exist in db', () => {
		cy.get('.w-80.p-2').clear();
		cy.get('.w-80.p-2').type('Admin User');
		cy.get('.\\[\\&_tr\\:last-child\\]\\:border-0 > .border-b > :nth-child(3)').should('have.text', 'Admin User');
	});

	it('ci name not exist in db', () => {
		cy.get('.w-80.p-2').clear();
		cy.get('.w-80.p-2').type(faker.person.fullName());
		cy.get('.border-b > .p-4').should('have.text', 'No se han encontrado usuarios.');
	});

	// Status
	it('cv status exist in db', () => {
		cy.get('.flex > :nth-child(4)').select('true');
		cy.get(':nth-child(1) > :nth-child(5) > .h-full > .min-w-20').should('have.text', 'Activo');
	});

	// role
	it('cv role exist in db', () => {
		cy.get('.flex-wrap > :nth-child(5)').select(Cypress.env('VITE_ADMIN_ROLE'));
		cy.get(':nth-child(1) > :nth-child(4) > .flex > .my-auto').should('have.text', 'Administrador');
	});
});
