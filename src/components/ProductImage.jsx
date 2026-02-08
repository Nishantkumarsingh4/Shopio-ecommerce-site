"use client";

import { useState } from "react";

export default function ProductImage({ src, alt, className }) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <img
            src={imgSrc || "https://dummyimage.com/400x400/ced4da/6c757d.jpg&text=No+Image"}
            alt={alt}
            onError={() => setImgSrc("https://dummyimage.com/400x400/ced4da/6c757d.jpg&text=No+Image")}
            className={className}
        />
    );
}
