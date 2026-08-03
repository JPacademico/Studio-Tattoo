import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Process } from '@/components/sections/Process'
import { Manifesto } from '@/components/sections/Manifesto'
import { Faq } from '@/components/sections/Faq'
import { Contact } from '@/components/sections/Contact'
import { FinalCta } from '@/components/layout/Footer'

/** Artists and the polaroid board now live on their own page — see GalleryPage. */
export function HomePage() {
  return (
    <main id="conteudo">
      <Hero />
      <About />
      <Process />
      <Manifesto />
      <Faq />
      <Contact />
      <FinalCta />
    </main>
  )
}
