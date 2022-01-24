import { Box, BoxProps, Button, MobileStepper } from "@mui/material";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import theme from "./theme";
import Image from "next/image";
import { SxProps, Theme } from "@mui/system";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export default function ImageGallery({ images, color, sx, ...boxProps }: {
    images: string[],
    color?: string
} & BoxProps) {
    const [activeStep, setActiveStep] = useState(0);

    const buttonStyles: SxProps<Theme> = {
        fontSize: "1.25rem",
        lineHeight: "initial",
        color: color ?? undefined,
        fontFamily: '"NeueBit Bold", sans-serif',
        "&:hover": {
            backgroundColor: color ? color + "0a" : undefined /* 20/255 in hex (about 0.04, the opacity of the MUI-styled background) */
        }
    };
    
    return (
        <Box {...boxProps} sx={{
            display: "flex",
            flexDirection: "column",
            "& .react-swipeable-view-container": {
                height: "100%"
            },
            ...sx
        }}>
            <AutoPlaySwipeableViews
                axis="x"
                index={activeStep}
                onChangeIndex={step => setActiveStep(step)}
                enableMouseEvents
                style={{
                    flex: 1
                }}
            >
                {images.map((step, index) => (
                    <div key={step} style={{
                        height: "100%"
                    }}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <Box sx={{
                                // height: "max(100%, 500px)",
                                height: "100%",
                                display: "block",
                                overflow: "hidden",
                                width: "100%",
                                position: "relative",
                                "& img": {
                                    userDrag: "none"
                                }
                            }}>
                                <Image layout="fill" objectFit="contain" src={step} draggable={false} />
                            </Box>
                        ) : null}
                    </div>
                ))}
            </AutoPlaySwipeableViews>
            <MobileStepper
                sx={{
                    //bgcolor: theme.palette.primary.light + " !important",
                    bgcolor: "rgba(0,0,0,0.05) !important",
                    "& .custom-dotactive": {
                        bgcolor: color ?? theme.palette.info.main
                    }
                }}
                classes={{
                    dotActive: "custom-dotactive"
                }}
                steps={images.length}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        onClick={() => setActiveStep(s => s + 1)}
                        disabled={activeStep === images.length - 1}
                        color="info"
                        sx={buttonStyles}
                    >
                        Next →
                    </Button>
                }
                backButton={
                    <Button
                        onClick={() => setActiveStep(s => s - 1)}
                        disabled={activeStep === 0}
                        color="info"
                        sx={buttonStyles}
                    >
                        ← Back
                    </Button>
                }
            />
        </Box>
    )
}