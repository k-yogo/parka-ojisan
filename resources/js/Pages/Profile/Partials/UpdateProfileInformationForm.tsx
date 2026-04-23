import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useRef } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            user_id: user.user_id,
            icon: null as File | null,
            _method: 'patch',
            remove_icon: false,
        });

    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="user_id" value="User ID" />

                    <TextInput
                        id="user_id"
                        className="mt-1 block w-full"
                        value={data.user_id}
                        onChange={(e) => setData('user_id', e.target.value)}
                        required
                    />

                    <InputError className="mt-2" message={errors.user_id} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="icon" value="Profile Image" />

                    {user.icon_path && !data.remove_icon && !preview && (
                        <div className="mt-1 flex items-center gap-4">
                            <img
                                src={`/storage/${user.icon_path}`}
                                className="h-16 w-16 rounded-full object-cover"
                            />
                            <button
                                type="button"
                                className="text-sm text-red-600 hover:underline"
                                onClick={() => setData('remove_icon', true)}
                            >
                                Delete
                            </button>
                        </div>
                    )}

                    {preview && (
                        <div className="my-2 flex items-center gap-4">
                            <img
                                src={preview}
                                className="h-16 w-16 rounded-full object-cover"
                            />
                            <button
                                type="button"
                                className="text-sm text-red-600 hover:underline"
                                onClick={() => {
                                    setPreview(null);
                                    setData('icon', null);
                                    if (fileInputRef.current)
                                        fileInputRef.current.value = '';
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    )}

                    <input
                        id="icon"
                        type="file"
                        accept="image/*"
                        className="my-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-800 file:text-white file:text-sm file:cursor-pointer"
                        ref={fileInputRef}
                        onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setData('icon', file);
                            setData('remove_icon', false);
                            setPreview(file ? URL.createObjectURL(file) : null);
                        }}
                    />

                    <InputError className="mt-2" message={errors.icon} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
