interface ExportarPDFOptions {
  elementoId: string
  nomeFicheiro: string
  orientacao?: 'portrait' | 'landscape'
  formato?: 'a4' | 'a3' | 'letter'
  qualidade?: number
}

/**
 * Exporta um elemento HTML para PDF com alta qualidade
 *
 * Usa importação dinâmica para:
 * - Evitar problemas com Turbopack (jsPDF tem deps opcionais)
 * - Reduzir o bundle inicial (só carrega quando o user clica)
 */
export async function exportarElementoParaPDF({
  elementoId,
  nomeFicheiro,
  orientacao = 'portrait',
  formato = 'a4',
  qualidade = 0.95,
}: ExportarPDFOptions): Promise<void> {
  // Importação dinâmica — só carrega quando esta função é chamada
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas-pro'),
  ])

  const elemento = document.getElementById(elementoId)
  if (!elemento) {
    throw new Error(`Elemento "${elementoId}" não encontrado.`)
  }

  // Capturar o elemento com escala alta (melhor qualidade)
  const canvas = await html2canvas(elemento, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  })

  // Criar PDF
  const pdf = new jsPDF({
    orientation: orientacao,
    unit: 'mm',
    format: formato,
    compress: true,
  })

  // Dimensões do PDF
  const pdfLargura = pdf.internal.pageSize.getWidth()
  const pdfAltura = pdf.internal.pageSize.getHeight()

  // Margens
  const margem = 8
  const larguraUtil = pdfLargura - margem * 2
  const alturaUtil = pdfAltura - margem * 2

  // Dimensões da imagem proporcionalmente
  const imgLargura = larguraUtil
  const imgAltura = (canvas.height * imgLargura) / canvas.width

  // Converter canvas para imagem (JPEG = mais leve)
  const imgData = canvas.toDataURL('image/jpeg', qualidade)

  // Se cabe numa só página
  if (imgAltura <= alturaUtil) {
    pdf.addImage(
      imgData,
      'JPEG',
      margem,
      margem,
      imgLargura,
      imgAltura,
      undefined,
      'FAST'
    )
  } else {
    // Paginação: divide a imagem em várias páginas
    const escalaPxPorMm = canvas.width / larguraUtil
    const alturaUtilPx = alturaUtil * escalaPxPorMm

    let posicaoY = 0
    let pagina = 0

    while (posicaoY < canvas.height) {
      const alturaPaginaPx = Math.min(
        alturaUtilPx,
        canvas.height - posicaoY
      )

      // Criar canvas da página atual
      const paginaCanvas = document.createElement('canvas')
      paginaCanvas.width = canvas.width
      paginaCanvas.height = alturaPaginaPx

      const ctx = paginaCanvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, paginaCanvas.width, paginaCanvas.height)
      ctx.drawImage(
        canvas,
        0,
        posicaoY,
        canvas.width,
        alturaPaginaPx,
        0,
        0,
        canvas.width,
        alturaPaginaPx
      )

      const paginaImg = paginaCanvas.toDataURL('image/jpeg', qualidade)
      const paginaAlturaMm = alturaPaginaPx / escalaPxPorMm

      if (pagina > 0) pdf.addPage()

      pdf.addImage(
        paginaImg,
        'JPEG',
        margem,
        margem,
        imgLargura,
        paginaAlturaMm,
        undefined,
        'FAST'
      )

      posicaoY += alturaPaginaPx
      pagina++
    }
  }

  // Guardar
  pdf.save(nomeFicheiro)
}