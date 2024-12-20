import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#2563eb] text-white py-4">
      <div className="container mx-auto px-2">
        {/* Certificates Section */}
        <div className="flex justify-center items-center gap-4 mb-4">
          {/* <Image src="/ebit.png" alt="Ebit" width={100} height={40} /> */}
          <Image
            src="/consumidor.png"
            alt="Consumidor"
            width={30}
            height={30}
          />
          <Image src="/config.png" alt="Confi" width={90} height={45} />
          <Image
            src="/reclameaq.png"
            alt="Reclame Aqui"
            width={90}
            height={30}
          />
        </div>

        {/* Legal Text Section */}
        <div className="text-center space-y-2 text-xs">
          <p>
            Preços e condições exclusivos para compras via internet. Ofertas
            válidas na compra de até 5 peças de cada produto por cliente.
          </p>
          <p>
            O Magazine Luiza atua como correspondente no País, nos termos da
            Resolução CMN nº 4.935/2021.
          </p>
          <p>Magazine Luiza S/A - CNPJ: 47.960.950/1088-36</p>
          <p>
            ® Magazine Luiza – Todos os direitos reservados.
            <a
              href="https://www.magazineluiza.com.br"
              className="hover:underline"
            >
              www.magazineluiza.com.br
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
