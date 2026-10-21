'use client';

import { startTransition, useActionState, type FormEvent, type ReactNode } from 'react';
import type { SaveState } from '@/lib/admin/store';

/** A form bound to a Server Action that returns SaveState; shows the result above the submit button. */
export function AdminForm({
  action,
  submit,
  danger,
  children,
}: {
  action: (state: SaveState, formData: FormData) => Promise<SaveState>;
  submit: string;
  danger?: boolean;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  // Submitting through onSubmit instead of <form action> skips React's automatic form reset,
  // so a rejected save keeps what was typed.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  };

  return (
    <form onSubmit={onSubmit} className="adm-form">
      {children}
      <div className="adm-submit">
        {state ? (
          <p className={state.ok ? 'adm-msg adm-ok' : 'adm-msg adm-error'} role="status">
            {state.ok ? 'บันทึกแล้ว' : state.message}
          </p>
        ) : null}
        <button type="submit" className={danger ? 'adm-btn adm-btn-danger' : 'adm-btn adm-btn-primary'} disabled={pending}>
          {pending ? 'กำลังบันทึก…' : submit}
        </button>
      </div>
    </form>
  );
}
