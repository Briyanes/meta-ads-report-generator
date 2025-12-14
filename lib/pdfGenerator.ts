import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDFFromHTML(htmlContent: string, filename: string = 'meta-ads-report.pdf'): Promise<Blob> {
  // Try to find existing iframe first (if report is already displayed)
  let targetElement: HTMLElement | null = null
  const existingIframe = document.querySelector('iframe[srcDoc]') as HTMLIFrameElement
  
  if (existingIframe && existingIframe.contentDocument) {
    // Use existing iframe
    const iframeDoc = existingIframe.contentDocument
    const iframeBody = iframeDoc.body || iframeDoc.documentElement
    if (iframeBody && iframeBody.scrollHeight > 0) {
      targetElement = iframeBody
    }
  }

  // If no existing iframe, create a new one
  let container: HTMLDivElement | null = null
  let iframe: HTMLIFrameElement | null = null
  
  if (!targetElement) {
    container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '1200px'
    container.style.height = 'auto'
    container.style.zIndex = '-9999'
    container.style.visibility = 'hidden'
    document.body.appendChild(container)

    // Create iframe for better rendering
    iframe = document.createElement('iframe')
    iframe.style.width = '1200px'
    iframe.style.height = '10000px'
    iframe.style.border = 'none'
    container.appendChild(iframe)

    // Wait for iframe to load
    await new Promise<void>((resolve) => {
      iframe!.onload = () => resolve()
      iframe!.srcdoc = htmlContent
    })

    // Wait for React to render (Babel transformation takes time)
    await new Promise(resolve => setTimeout(resolve, 3000))

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    if (!iframeDoc) {
      throw new Error('Cannot access iframe document')
    }

    targetElement = iframeDoc.body || iframeDoc.documentElement
    
    // Wait for React root to be populated
    let retries = 0
    while (retries < 10) {
      const rootElement = iframeDoc.getElementById('root')
      if (rootElement && rootElement.children.length > 0 && rootElement.scrollHeight > 0) {
        targetElement = rootElement
        break
      }
      await new Promise(resolve => setTimeout(resolve, 500))
      retries++
    }
    
    // Ensure element has valid dimensions
    if (!targetElement || targetElement.scrollHeight === 0) {
      // Try using body as fallback
      const body = iframeDoc.body
      if (body && body.scrollHeight > 0) {
        targetElement = body
      } else {
        throw new Error('Content did not render properly in iframe')
      }
    }
  }

  try {
    // Wait for all images to load
    const images = targetElement.querySelectorAll('img')
    const imagePromises = Array.from(images).map((img: HTMLImageElement) => {
      return new Promise<void>((resolve) => {
        if (img.complete && img.naturalHeight !== 0) {
          resolve()
        } else {
          img.onload = () => resolve()
          img.onerror = () => resolve() // Continue even if image fails
          setTimeout(() => resolve(), 5000) // Timeout after 5 seconds
        }
      })
    })
    await Promise.all(imagePromises)

    // Additional wait for fonts, external resources, and React to fully render
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Verify content is actually rendered
    const hasContent = targetElement.textContent && targetElement.textContent.trim().length > 0
    if (!hasContent) {
      throw new Error('Content appears to be empty. React may not have finished rendering.')
    }

    // Get actual dimensions
    const width = targetElement.scrollWidth || 1200
    const height = targetElement.scrollHeight || 1000

    if (height === 0 || width === 0) {
      throw new Error(`Invalid dimensions: width=${width}, height=${height}`)
    }

    // Convert HTML to canvas
    const canvas = await html2canvas(targetElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true, // Allow tainted canvas for better rendering
      logging: true, // Enable logging for debugging
      backgroundColor: '#ffffff',
      width: width,
      height: height,
      windowWidth: width,
      windowHeight: height,
      removeContainer: false,
      onclone: (clonedDoc, element) => {
        // Ensure all styles are applied in cloned document
        const clonedElement = element as HTMLElement
        if (clonedElement) {
          clonedElement.style.width = `${width}px`
          clonedElement.style.backgroundColor = '#ffffff'
          clonedElement.style.position = 'relative'
        }
        // Ensure React root is visible
        const clonedRoot = clonedDoc.getElementById('root')
        if (clonedRoot) {
          clonedRoot.style.display = 'block'
          clonedRoot.style.visibility = 'visible'
        }
      }
    })

    // Validate canvas
    if (!canvas) {
      throw new Error('Canvas creation failed')
    }
    
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error(`Canvas is empty: width=${canvas.width}, height=${canvas.height}`)
    }

    // Convert to image - try PNG first, fallback to JPEG
    let imgData: string
    let imageFormat: 'PNG' | 'JPEG' = 'PNG'
    
    try {
      imgData = canvas.toDataURL('image/png', 1.0)
      if (!imgData || imgData.length < 100 || !imgData.startsWith('data:image/png')) {
        throw new Error('Invalid PNG data')
      }
    } catch (pngError) {
      console.warn('PNG conversion failed, trying JPEG:', pngError)
      try {
        imgData = canvas.toDataURL('image/jpeg', 0.92)
        imageFormat = 'JPEG'
        if (!imgData || imgData.length < 100 || !imgData.startsWith('data:image/jpeg')) {
          throw new Error('Invalid JPEG data')
        }
      } catch (jpegError) {
        throw new Error(`Failed to convert canvas to image: ${jpegError}`)
      }
    }

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Split into pages
    let heightLeft = imgHeight
    let position = 0

    // Add first page
    pdf.addImage(imgData, imageFormat, 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add remaining pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, imageFormat, 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Cleanup
    if (container && container.parentNode) {
      document.body.removeChild(container)
    }

    // Return as blob
    return pdf.output('blob')
  } catch (error: any) {
    // Cleanup on error
    if (container && container.parentNode) {
      document.body.removeChild(container)
    }
    console.error('PDF Generation Error:', error)
    throw new Error(`Failed to generate PDF: ${error.message || String(error)}`)
  }
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

