import { lazy } from "solid-js";

const CreateForm = lazy(() => import("../components/CreateForm"));

function CreatePage() {

    return (
        <div class="flex items-center justify-center h-screen">
            <CreateForm />
        </div>
    );
}

export default CreatePage;