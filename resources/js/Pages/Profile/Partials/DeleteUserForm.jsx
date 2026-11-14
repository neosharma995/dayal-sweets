import React, { useRef, useState } from 'react';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={className}>
            <header>
                <h3 className="dayal-font-serif">
                    Delete Account
                </h3>
                <p className="dayal-text-muted dayal-mt-1">
                    Once your account is deleted, all of its resources and data will be permanently deleted.
                </p>
            </header>

            <div className="dayal-mt-4">
                <DangerButton onClick={confirmUserDeletion}>
                    Delete Account
                </DangerButton>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser}>
                    <h3 className="dayal-font-serif">
                        Are you sure you want to delete your account?
                    </h3>

                    <p className="dayal-text-muted dayal-mt-2">
                        Please enter your password to confirm you would like to permanently delete your account.
                    </p>

                    <div className="dayal-form-group dayal-mt-4">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            isFocused
                            placeholder="Password"
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="dayal-flex-start dayal-mt-4">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

                        <DangerButton disabled={processing}>
                            Delete Account
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
