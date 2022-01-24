import * as React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { BerowraAssignment, getAssignments, getAssignmentsCollection, GetAssignmentsRes } from '../src/berowra';
import { Button, Card, CardHeader, Chip, Link, Modal, Paper, Portal } from '@mui/material';
import Image from 'next/image';
import theme from '../src/theme';
import Marquee from "../src/MarqueePolyfill";
import Masonry from "@mui/lab/Masonry";
import { useRouter } from 'next/router';
import MarkdownRenderer from '../src/MarkdownRenderer';
import ImageGallery from '../src/ImageGallery';

type NPairArray = [number, number][]

type IndexProps = {
  data: GetAssignmentsRes,
  randomPos: NPairArray,
  randomShadow: NPairArray
};

let hasSetMutationObserver = false;

const COOL_TIMING_FUNCTION = "cubic-bezier(.17,.84,.44,1)";

const setPoofCalculatedRadius = () => document.documentElement.style.setProperty("--poof-calculated-radius", Math.sqrt(document.body.clientWidth ** 2 + document.body.clientHeight ** 2).toString() + "px");

export default function Index({ data, randomPos, randomShadow }: IndexProps) {
  const router = useRouter();
  const [masonryDone, setMasonryDone] = React.useState(false);
  const masonryRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if(!masonryRef.current || hasSetMutationObserver) return;
    hasSetMutationObserver = true;
    const o = new MutationObserver((mutationsList, observer) => {
      setMasonryDone(true);
      observer.disconnect();
    });

    o.observe(masonryRef.current, {
      attributes: true, childList: true, subtree: true
    });
  }, []);

  const refetchOpenItem = () => router.query.item?.[0] ? data.items.find(i => i.title === router.query.item![0]) : undefined;

  const [openItem, setOpenItem] = React.useState<BerowraAssignment | undefined>(refetchOpenItem);

  React.useEffect(() => {
    setOpenItem(refetchOpenItem());
  }, [router.query.item]);

  const [exiting, setExiting] = React.useState<boolean>(false);
  const modalRef = React.useRef<HTMLDivElement>(null);
  // const modalRootRef = React.useRef<HTMLDivElement>(null);

  // React.useEffect(() => {
  //   history.pushState({}, "", openItem ? "/" + encodeURIComponent(openItem.title) : "/");
  // }, [openItem]);

  React.useEffect(() => {
    if(exiting) {
      const handler = () => {
        // setOpenItem(undefined);
        router.push("/", undefined, { shallow: true });
        setExiting(false);
        // The effect handler would do this but we need to do it in the same render to avoid flashes of the modal
        setOpenItem(undefined);
        modalRef.current?.removeEventListener("animationend", handler);
      }

      modalRef.current?.addEventListener("animationend", handler);
    }
  }, [exiting]);

  return (
    <>
      <Box sx={{
        position: "sticky",
        top: 0,
        bgcolor: "primary.main",
        height: "36px",
        zIndex: 999
      }}>
        <Marquee>
          <Typography sx={{
            display: "inline-block",
            width: "max-content"
          }}>Welcome to my portfolio</Typography>
        </Marquee>
      </Box>
      <Box sx={{
        bgcolor: "primary.main",
        borderBottom: "2px solid",
        borderBottomColor: "primary.dark",
        paddingY: "10rem"
      }}>
        <Container maxWidth="lg">
          <Typography variant="h2">Benjamin Smith</Typography>
          <Typography variant="h1">Media portfolio</Typography>
        </Container>
      </Box>
      {/* <Container maxWidth="lg" sx={{
        marginY: theme.spacing(4),
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: theme.spacing(4)
      }}> */}
      <Container maxWidth="lg" sx={{
        marginY: theme.spacing(6)
      }}>
        <Masonry
          columns={{ sm: 2, md: 3 }}
          spacing={4}
          ref={masonryRef}
        >
          {data.items.map((item, index) => (
            <Link key={index} href={`/${encodeURIComponent(item.title)}`} sx={{
              visibility: masonryDone ? "inherit" : "hidden"
            }} onClick={e => {
              e.preventDefault();
              document.documentElement.style.setProperty("--poof-x", e.clientX.toString() + "px");
              document.documentElement.style.setProperty("--poof-y", e.clientY.toString() + "px");
              // Sadly CSS doesn't support square root
              setPoofCalculatedRadius();
              router.push(`/${encodeURIComponent(item.title)}`, undefined, { shallow: true });
              //setOpenItem(item);
            }}>
              <Card variant="outlined" sx={{
                // TODO: maybe keep this? bgcolor: item.content.Background.value ?? undefined,
                display: "inline-block",
                width: "350px",
                maxWidth: "100%",
                position: "relative",
                top: randomPos[index][0],
                left: randomPos[index][1],
                boxShadow: `${randomShadow[index][0]}px ${randomShadow[index][1]}px ${item.content.Background.value ?? "black"}`,
                // borderWidth: "4px"
                borderStyle: "ridge",
                borderWidth: "4mm",
                // a6a6a691
                borderColor: "#97979791",
                ":hover": {
                  top: randomPos[index][0] - 10,
                  left: randomPos[index][1] - 10,
                  boxShadow: `${randomShadow[index][0] + 20}px ${randomShadow[index][1] + 20}px ${item.content.Background.value ?? "black"}`
                },
                transform: masonryDone ? "inherit" : "scale(0)",
                transition: `all 1s ${COOL_TIMING_FUNCTION}`
              }}>
                <CardHeader title={item.title} subheader={item.content.Date.value} titleTypographyProps={{
                  variant: "h4"
                }} />
                <Box sx={{
                  position: "relative",
                  height: "300px"
                }}>
                  <Image
                    src={process.env.NEXT_PUBLIC_BEROWRA_INST + "/file/" + item.content.Images.value[0]}
                    alt="Assignment picture"
                    layout="fill"
                    objectFit="cover"
                  />
                </Box>
              </Card>
            </Link>
          ))}
        </Masonry>
      </Container>

      {/* {openItem && (
        <Head>
          <style>
            {`body { overflow: hidden; }`}
          </style>
        </Head>
      )} */}

      {/* <Box ref={modalRootRef}> */}
        <Modal
          ref={modalRef}
          // disablePortal={typeof window === "undefined"}
          // container={typeof window === "undefined" ? () => modalRootRef.current : undefined}
          open={Boolean(openItem)}
          sx={{
            animationName: exiting ? "unpoof" : "poof",
            animationDuration: "0.5s",
            animationTimingFunction: COOL_TIMING_FUNCTION,
            // clipPath: (exiting || !openItem) ? "circle(0 at 0 0)" : "inherit"
          }}
          BackdropProps={{
            sx: {
              bgcolor: "white",
              transition: "inherit !important"
            }
          }}
        >
          <Paper variant="outlined" sx={{
            //padding: theme.spacing(4),
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: "calc(100% - 12rem)",
            maxWidth: "850px",
            height: "calc(100vh - 6rem)",
            minHeight: "min(100vh, 600px)",
            borderWidth: "0.5rem",
            display: "flex",
            flexDirection: "column"
          }}>
            <Portal container={modalRef.current}>
              <Button disableRipple sx={{
                position: "fixed",
                right: "1rem",
                top: "1rem",
                zIndex: 99999,
                fontSize: "4rem",
                fontFamily: "NeueBit Bold",
                paddingTop: 0,
                paddingBottom: "0.5rem",
                lineHeight: 1,
                "&:focus": {
                  bgcolor: "#e0f4f2",
                }
              }} onClick={() => {
                setPoofCalculatedRadius();
                setExiting(true);
                // TODO: move route change back here?
              }}>
                x
              </Button>
            </Portal>
            <Typography variant="h3" sx={{
              padding: "1rem",
              bgcolor: openItem?.content.Background.value ?? "inherit"
            }}>{openItem?.title}</Typography>
            <Box sx={{
              padding: "1rem",
              flex: 1,
              display: "flex",
              flexDirection: "column"
            }}>
              <Chip label={openItem?.content.Date.value} variant="outlined" sx={{
                fontSize: 20,
                borderRadius: 0,
                width: "max-content"
              }} />
              <ImageGallery
                images={openItem?.content.Images.value.map(f => process.env.NEXT_PUBLIC_BEROWRA_INST + "/file/" + f) ?? []}
                sx={{
                  flex: 1
                }}
              />
              <MarkdownRenderer text={openItem?.content.Info.value ?? ""} />
            </Box>
          </Paper>
        </Modal>
      {/* </Box> */}
    </>
  );
};

export const getStaticProps: GetStaticProps<IndexProps> = async (ctx) => {
  const data = await getAssignments();
  return {
    props: {
      data,
      randomPos: data.items.map(() => [Math.random(), Math.random()].map(r => (0.5 - r) * 20)) as NPairArray,
      randomShadow: data.items.map(() => [Math.random(), Math.random()].map(r => r * 10 + 5)) as NPairArray
    },
    revalidate: 10
  }
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  return {
    paths: [
      ...(await getAssignmentsCollection()).items.map(a => ({ params: { item: [a.title] } })),
      { params: { item: [] } }
    ],
    fallback: "blocking"
  }
}