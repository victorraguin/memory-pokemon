import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '../context/UserProvider'
import './Home.css'
import { useNavigate } from 'react-router-dom'

type FormData = {
  email: string
  password: string
}

const formSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
})

export default function Home () {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { setUser } = useUser()
  const navigate = useNavigate()

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const onSubmit = (data: FormData) => {
    setUser(data)
    navigate('/memory-game')
    localStorage.setItem('user', JSON.stringify(data))
    handleCloseModal()
  }

  return (
    <div className='home-container'>
      <h1>Jeu de Mémoire Pokémon</h1>
      <p>
        Bienvenue dans notre jeu de mémoire! Testez vos compétences en trouvant
        les paires de Pokémon.
      </p>

      <button className='play-button' onClick={handleOpenModal}>
        Jouer
      </button>

      {isModalOpen && (
        <div className='modal-overlay' onClick={handleCloseModal}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <h2>S'enregistrer</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='form-group'>
                <label htmlFor='email'>Adresse email</label>
                <input
                  {...register('email')}
                  type='email'
                  id='email'
                  autoComplete='email'
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p className='error-message' role='alert'>
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className='form-group'>
                <label htmlFor='password'>Mot de passe</label>
                <input
                  {...register('password')}
                  type='password'
                  id='password'
                  autoComplete='current-password'
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && (
                  <p className='error-message' role='alert'>
                    {errors.password.message}
                  </p>
                )}
              </div>
              {errors.root && (
                <p className='error-message' role='alert'>
                  {errors.root.message}
                </p>
              )}
              <button
                type='submit'
                className='submit-button'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Chargement...' : 'Commencer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
