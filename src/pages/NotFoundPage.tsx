import { ArrowLeft } from 'lucide-react'
import { Link } from '@/lib/router'
import { buttonStyles } from '@/components/ui/Button'
import { LogoMark } from '@/components/layout/Logo'

export function NotFoundPage() {
  return (
    <main
      id="conteudo"
      className="relative grid min-h-svh place-items-center px-5 pt-28 pb-20 text-center"
    >
      <div>
        <LogoMark className="mx-auto size-16 text-ember/70" />

        <p className="eyebrow mt-8">Erro 404</p>
        <h1 className="mt-4 text-[clamp(2.4rem,8vw,4.5rem)] leading-[0.94] text-bone">
          Essa página
          <span className="block italic text-dust">não foi tatuada.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-[0.9rem] leading-relaxed text-muted">
          O link que você seguiu não existe por aqui. Volte para o início ou marque sua sessão
          direto.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className={buttonStyles('primary', 'lg')}>
            <ArrowLeft size={16} />
            Voltar ao início
          </Link>
          <Link to="/agendar" className={buttonStyles('outline', 'lg')}>
            Planejar / Agendar
          </Link>
        </div>
      </div>
    </main>
  )
}
