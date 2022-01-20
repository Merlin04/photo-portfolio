import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react"
import { SxProps, Theme } from "@mui/material";

let right = 0;

export default function Marquee(props: React.PropsWithChildren<{
    sx?: SxProps<Theme>
}>) {
    const [, setRerender] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            right += 8;
            const childWidth = (ref.current?.children[0] as HTMLElement).offsetWidth;
            if(ref.current && right > 50 + (childWidth + document.body.clientWidth)) {
                right = -50 - childWidth;
            }
            // Sure, that works
            setRerender(Math.random());
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        //@ts-expect-error - please typescript I have no idea what you're saying just let me have my marquee in peace
        <Box ref={ref} style={{
            zIndex: 2147483647,
            display: "inline-block",
            position: "absolute",
            right,
            ...props.sx
        }}>
            {props.children}
        </Box>
    )
}