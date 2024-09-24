import React, { useState } from 'react';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { Button, buttonVariants } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Input } from '@/components/ui/input';

export const Route = createLazyFileRoute('/')({
  component: App,
})

function App(): JSX.Element {
  const [clientPin, setClientPin] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  return (
    <div className="lg:grid-cols-2 sm:flex lg:grid items-center justify-center h-[100vh] max-w-screen-xl sm:m-4 lg:mx-auto">
      <div className="space-y-4 justify-self-center">
        <h1 className="text-6xl font-bold">Hello there!</h1>
        <h2 className="text-xl font-bold">Are you ready to play?</h2>
        <h2 className="text-xl">Time to enter your quiz’s PIN and let’s get started</h2>
        <InputOTP maxLength={4} onChange={setClientPin}>
          <InputOTPGroup>
            <InputOTPSlot index={0}/>
            <InputOTPSlot index={1}/>
            <InputOTPSlot index={2}/>
            <InputOTPSlot index={3}/>
          </InputOTPGroup>
        </InputOTP>
        <div className="space-x-4">
          <Button>Enter the game!</Button>
        </div>
      </div>
      <div className="space-y-4 justify-self-center">
        <h1 className="text-6xl font-bold">Wanna create or manage the game?</h1>
        <h2 className="text-xl font-bold">Enter the password of the created game</h2>
        <Input onChange={(e) => {
          setAdminPassword(e.target.value);
        }} placeholder="Password..."/>
        <Button>Manage the game!</Button>
        <h2 className="text-xl font-bold">OR</h2>
        <Link className={buttonVariants({ variant: 'outline' })} to="/admin/create">Create new quiz</Link>
      </div>
    </div>
  );
}
