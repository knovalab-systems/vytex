function ErrorMessage(props: { title?: string; subtitle?: string; tips?: string }) {
	return (
		<div class='h-full w-full flex'>
			<div class='flex m-auto flex-col items-center justify-center gap-2 p-8 bg-white rounded-md border border-gray-100 shadow-xl'>
				<p class='text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-red-600 text-center'>
					{props.title || 'Error'}
				</p>
				<p class='text-gray-500 text-xl text-center'>{props.subtitle || 'Hubo un error durante la ejecución'}</p>
				<p class='text-gray-500 text-sm text-center'>
					{props.tips || 'Refresca la página ó contacta con el administrador'}
				</p>
			</div>
		</div>
	);
}

export default ErrorMessage;
