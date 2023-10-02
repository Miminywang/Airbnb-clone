'use client';

import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation'

import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';

import Modal from './Modal';
import Heading from '../Heading'
import Input from '../inputs/Input';
import Button from '../Button';


const LoginModal = () => {
    const router = useRouter();
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [ isLoading, setIsLoading ] = useState(false);

    //使用useForm初始化表單，並提取相關狀態與函式
    const {
        register, 
        handleSubmit, 
        formState: {
            errors,
        }
    } = useForm <FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) =>{
        setIsLoading(true);

        signIn('credentials', {
            ...data,
            redirect: false,
        })
        .then((callback) => {
            setIsLoading(false);

            if(callback?.ok){
                toast.success('Logged in');
                router.refresh();
                loginModal.onClose();
            }

            if (callback?.error) {
                toast.error(callback.error);
            }
        });
    }

    const onToggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal])

    const bodyContent =(
        <div className='flex flex-col gap-4'>
            <Heading 
                title="Welcome back"
                subtitle="Login to your account!"    
            />
            
            <Input 
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            
            <Input 
                id="password"
                type="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    );

    //使用NextAuth.js提供的signIn函式啟動外部認證流程
    const footerContent =(
        <div className='flex flex-col gap-4 mt-3'>
            <hr />
            <Button 
                outline
                label="Continue with Google"
                icon={FcGoogle}
                onClick={() => signIn('google')}
            />
            <Button 
                outline
                label="Continue with Github"
                icon={AiFillGithub}
                onClick={() => signIn('github')}
            />
            <div className="text-neutral-500 text-center mt-4 font-light">
                <p>First time using Airbnb?
                    <span 
                        onClick={onToggle} 
                        className="
                        text-neutral-800
                        cursor-pointer 
                        hover:underline
                    "> Create an account
                    </span>
                </p>
            </div>
        </div>
    )

    return ( 
        <Modal 
            disabled={ isLoading }
            isOpen={ loginModal.isOpen }
            title='Login'
            actionLabel='Continue'
            onClose={ loginModal.onClose }
            onSubmit={ handleSubmit(onSubmit) } 
            body={ bodyContent }
            footer={ footerContent }
        />
     );
}
 
export default LoginModal;