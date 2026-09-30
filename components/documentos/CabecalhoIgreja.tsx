import Image from 'next/image'

interface Props {
  compacto?: boolean
}

export default function CabecalhoIgreja({ compacto = false }: Props) {
  const espacamento = compacto ? 'space-y-0.5' : 'space-y-1'
  const tamanhoLogo = compacto ? 64 : 80

  return (
    <div className="border-b-2 border-blue-900 pb-5 mb-6">
      <div className="flex items-center gap-5">
        {/* Logotipo */}
        <div
          className="flex-shrink-0 rounded-full overflow-hidden"
          style={{
            width: tamanhoLogo,
            height: tamanhoLogo,
          }}
        >
          <Image
            src="/logo.png"
            alt="Logotipo IEUCAA"
            width={tamanhoLogo}
            height={tamanhoLogo}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        {/* Texto do cabeçalho */}
        <div className={`flex-1 text-center ${espacamento}`}>
          <h1
            className={`${
              compacto ? 'text-sm' : 'text-base'
            } font-bold text-blue-950 tracking-wide uppercase`}
          >
            Igreja Evangélica Unida
          </h1>
          <p
            className={`${
              compacto ? 'text-xs' : 'text-sm'
            } font-semibold text-blue-900 uppercase tracking-wide`}
          >
            Comunhão Anglicana em Angola
          </p>
          <p
            className={`${
              compacto ? 'text-[11px]' : 'text-xs'
            } text-gray-600 uppercase tracking-wide`}
          >
            Diocese de Cristo Rei
          </p>
          <p
            className={`${
              compacto ? 'text-[11px]' : 'text-xs'
            } text-gray-600 uppercase tracking-wide`}
          >
            Distrito Eclesiástico de Mbemba Ngangu
          </p>
          <p
            className={`${
              compacto ? 'text-[11px]' : 'text-xs'
            } font-semibold text-blue-800 uppercase tracking-wide`}
          >
            Paróquia de São Filipe — Papelão, Uíge
          </p>
        </div>

        {/* Espaço simétrico para o texto ficar centrado */}
        <div
          className="flex-shrink-0"
          style={{ width: tamanhoLogo, height: tamanhoLogo }}
        />
      </div>
    </div>
  )
}