import { Form } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import MahasiswaController from '@/actions/App/Http/Controllers/Admin/MahasiswaController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    mahasiswaId: number;
    username: string;
};

export function ResetPasswordCard({ mahasiswaId, username }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <KeyRound className="size-4 text-muted-foreground" />
                    <span>Reset Password Akun</span>
                </CardTitle>
                <CardDescription>
                    Tetapkan password baru untuk akun{' '}
                    <span className="font-medium text-foreground">
                        @{username}
                    </span>
                    . Password lama langsung tidak berlaku setelah disimpan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form
                    {...MahasiswaController.resetPassword.form(mahasiswaId)}
                    resetOnSuccess
                    options={{ preserveScroll: true }}
                    className="space-y-4"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="reset_password">
                                        Password baru
                                    </Label>
                                    <PasswordInput
                                        id="reset_password"
                                        name="password"
                                        required
                                        autoComplete="new-password"
                                        placeholder="Minimal 8 karakter"
                                        className="h-11 md:h-9"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="reset_password_confirmation">
                                        Konfirmasi password baru
                                    </Label>
                                    <PasswordInput
                                        id="reset_password_confirmation"
                                        name="password_confirmation"
                                        required
                                        autoComplete="new-password"
                                        placeholder="Ulangi password baru"
                                        className="h-11 md:h-9"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    disabled={processing}
                                    className="h-11 md:h-9"
                                >
                                    {processing && <Spinner />}
                                    <span>Simpan Password Baru</span>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
