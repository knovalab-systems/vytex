import { createForm, valiForm } from "@modular-forms/solid";
import { useNavigate } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/Label";
import { SUPPLIERS_PATH } from "~/constants/paths";
import type { GetSupplierType } from "../requests/supplierGet";
import { SupplierUpdateSchema, type SupplierUpdateType } from "../schemas/supplierUpdate";

function SupplireUpdateForm(props: { supplier?: GetSupplierType }) {
    const navigate = useNavigate();

    const [form, { Form, Field }] = createForm<SupplierUpdateType>({
        validate: valiForm(SupplierUpdateSchema),
        initialValues: {
            name: props.supplier?.name || 'pepe',
            brand: props.supplier?.brand,
            code: props.supplier?.code,
            nit: props.supplier?.nit,
        }
    });

    const handleCancel = () => navigate(SUPPLIERS_PATH);

    const handleSubmit = async (data: SupplierUpdateType) => {
        console.log(data);
    };


    return (
        <Form class='w-full lg:w-2/5 2xl:w-1/4' onSubmit={handleSubmit}>
            <div class='flex flex-col justify-center gap-4 p-8 m-4 bg-white rounded-md border border-gray-100 shadow-md'>
                <h1 class='text-2xl font-bold text-center'>Crear proveedor</h1>
                <Field name='name'>
                    {(field, props) => (
                        <div>
                            <Label for='name-field'>Nombre</Label>
                            <Input
                                placeholder='Nombre del proveedor'
                                autocomplete='off'
                                id='name-field'
                                aria-errormessage={field.error}
                                required
                                value={field.value}
                                {...props}
                            />
                        </div>
                    )}
                </Field>
                <Field name='brand'>
                    {(field, props) => (
                        <div>
                            <Label for='brand-field'>Marca</Label>
                            <Input
                                placeholder='Marca del proveedor'
                                autocomplete='off'
                                id='brand-field'
                                aria-errormessage={field.error}
                                required
                                value={field.value}
                                {...props}
                            />
                        </div>
                    )}
                </Field>
                <Field name='code' type='number'>
                    {(field, props) => (
                        <div>
                            <Label for='code-field'>Código</Label>
                            <Input
                                placeholder='2322'
                                autocomplete='off'
                                type='number'
                                id='code-field'
                                aria-errormessage={field.error}
                                required
                                value={field.value}
                                {...props}
                            />
                        </div>
                    )}
                </Field>
                <Field name='nit' type='number'>
                    {(field, props) => (
                        <div>
                            <Label for='nit-field'>NIT</Label>
                            <Input
                                placeholder='111111111'
                                autocomplete='off'
                                type='number'
                                id='nit-field'
                                aria-errormessage={field.error}
                                required
                                value={field.value}
                                {...props}
                            />
                        </div>
                    )}
                </Field>
            </div>
            <div class='flex justify-between m-4'>
                <Button type='button' onclick={handleCancel} class='bg-red-500 hover:bg-red-600'>
                    Cancelar
                </Button>
                <Button type='submit' disabled={form.submitting} class='bg-green-600 hover:bg-green-700'>
                    Actualizar
                </Button>
            </div>
        </Form>
    );
}

export default SupplireUpdateForm;