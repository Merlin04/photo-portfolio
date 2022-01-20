import * as React from 'react';
import type { GetStaticProps } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getAssignments, GetAssignmentsRes } from '../src/berowra';
import { Card, CardHeader, CardMedia } from '@mui/material';
import Image from 'next/image';
import theme from '../src/theme';
import Marquee from "../src/MarqueePolyfill";
import Link from "../src/Link";
import Masonry from "@mui/lab/Masonry";

type NPairArray = [number, number][]

type IndexProps = {
  data: GetAssignmentsRes,
  randomPos: NPairArray,
  randomShadow: NPairArray
};

let hasSetMutationObserver = false;

export default function Index({ data, randomPos, randomShadow }: IndexProps) {
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
  }, [masonryRef.current]);

  return (
    <>
      <Box sx={{
        position: "sticky",
        top: 0,
        bgcolor: "primary.main",
        height: "36px",
        zIndex: 9999
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
        marginY: theme.spacing(4)
      }}>
      <Masonry columns={3} spacing={4} ref={masonryRef}>
        {data.items.map((item, index) => (
          <Link href={`/a/${encodeURIComponent(item.title)}`} sx={{
            visibility: masonryDone ? "inherit" : "hidden"
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
              transition: "all 1s cubic-bezier(.17,.84,.44,1)"
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
      </Masonry></Container>
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