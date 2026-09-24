import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
export const metadata: Metadata = { title: "Política de privacidade | Parafa CNPJ", alternates: { canonical: "/politica-de-privacidade" } };
export default function PrivacyPage() {
  return <><SiteHeader /><main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-5 py-12 leading-7">
    <h1 className="text-3xl font-bold">Política de privacidade</h1>
    <p>Esta política descreve o tratamento de informações no diretório Parafa CNPJ. Para dúvidas ou solicitações, use o <a className="underline" href="https://parafa.com.br/contato">canal de contato do Parafa</a>.</p>
    <h2 className="text-xl font-bold">Informações do diretório</h2>
    <p>O diretório permite consultar informações cadastrais de empresas provenientes de bases públicas do CNPJ. A disponibilidade pública não elimina a necessidade de proteger dados pessoais. A data de atualização, quando disponível, aparece na ficha; informações podem divergir do cadastro atual. Para comprovação oficial, consulte a Receita Federal.</p>
    <h2 className="text-xl font-bold">Solicitações de remoção e correção</h2>
    <p>O formulário coleta nome, e-mail, vínculo declarado com os dados, CNPJ e descrição do pedido para confirmar o contato, analisar a solicitação e registrar seu resultado. Não envie documentos pessoais, senhas ou informações sensíveis no campo de mensagem.</p>
    <p>A confirmação do e-mail não comprova, por si só, autorização para alterar dados de uma empresa. A equipe pode solicitar informações adicionais. Os pedidos e registros de análise têm acesso restrito e são mantidos pelo tempo necessário ao atendimento e às obrigações aplicáveis. Você pode solicitar informações sobre sua conservação pelo canal de contato.</p>
    <p>Quando a remoção é aprovada, o cadastro deixa de ser exibido no diretório. Um registro de bloqueio é mantido para impedir que importações futuras o publiquem novamente. Resultados e cópias em buscadores externos dependem da atualização desses serviços.</p>
    <h2 className="text-xl font-bold">Publicidade, cookies e métricas</h2>
    <p>Usamos Google AdSense para exibir anúncios e Google Analytics para entender o uso do site. O Google e seus parceiros podem utilizar cookies e outros identificadores para medir anúncios e, conforme suas configurações e consentimentos aplicáveis, personalizar publicidade com base em visitas a este e a outros sites.</p>
    <p>Veja <a className="underline" href="https://policies.google.com/technologies/partner-sites">como o Google usa informações de sites parceiros</a>, gerencie anúncios em <a className="underline" href="https://myadcenter.google.com/">Minha Central de Anúncios</a> e consulte a <a className="underline" href="https://tools.google.com/dlpage/gaoptout">opção de desativação do Google Analytics</a>. Também é possível controlar cookies no navegador. Bloqueá-los pode afetar funcionalidades e anúncios.</p>
    <p>O conteúdo dos formulários de remoção e correção não é enviado por nós como evento de publicidade ou análise. As páginas de confirmação e acompanhamento não carregam esses scripts.</p>
    <h2 className="text-xl font-bold">Contato e exercício de direitos</h2>
    <p>Para pedir acesso, correção, remoção ou esclarecimentos sobre dados pessoais, use o formulário na ficha da empresa ou <a className="underline" href="https://parafa.com.br/contato">entre em contato</a>. Se já possui um protocolo, informe-o para facilitar o atendimento.</p>
  </main><SiteFooter /></>;
}
