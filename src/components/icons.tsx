import type { SVGProps } from "react";
import Image from "next/image";

export function StyleLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <Image
            src="/stylewise-logo.png"
            alt="StyleWise Logo"
            width={100}
            height={100}
            className={`w-auto ${props.className || ''}`}
            style={{
                maxHeight: '100%',
                objectFit: 'contain'
            }}
        />
    );
}
