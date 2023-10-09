// import {
//   Avatar,
//   Card,
//   createStyles,
//   Group,
//   Image,
//   rem,
//   SimpleGrid,
//   Text,
// } from '@mantine/core';
// import { type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal, type SetStateAction, useEffect, useState } from 'react';
// import InfiniteScroll from 'react-infinite-scroller';
// import { useInfiniteQuery } from 'react-query';
// // import { useNavigate } from 'react-router-dom';
// import { styled } from 'styled-components';
// import { baseUrl } from '../../axiosInstance/constants';

// // import { ReactComponent as Spinner } from '../../../../assets/Spinner.svg';

// const BlurredImg = styled.div`
//   background-repeat: no-repeat;
//   background-size: cover;
//   .before {
//     filter: blur(10px);
//   }
//   .before ::before {
//     content: '';
//     position: absolute;
//     inset: 0;
//     opacity: 0;
//     animation: pulse 2.5s infinite;
//     background-color: var(--text-color);
//   }

//   @keyframes pulse {
//     0% {
//       opacit: 0;
//     }
//     50% {
//       opacity: 0.1;
//     }
//     100% {
//       opacity: 0;
//     }
//   }
//   .loaded::before {
//     animation: none;
//     content: none;
//   }
//   & > img {
//     opacity: 0;
//     transition: opacity 250ms ease-in-out;
//   }

//   & .loaded > img {
//     opacity: 1;
//   }
// `;

// const useStyles = createStyles((theme) => ({
//   card: {
//     backgroundColor:
//       theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
//     transition: 'transform 150ms ease, box-shadow 150ms ease',

//     '&:hover': {
//       transform: 'scale(1.01)',
//       boxShadow: theme.shadows.md,
//     },
//     borderRadius: theme.radius.md,
//     boxShadow: theme.shadows.lg,
//     width: '98%',
//     margin: '2rem auto 1rem',
//   },

//   title: {
//     fontFamily: `Greycliff CF, ${theme.fontFamily}`,
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     marginTop: '1.5rem',
//     borderTop: '1px',
//     fontSize: '1rem',
//   },

//   desc: {
//     display: '-webkit-box',
//     overflow: 'hidden',
//     WebkitLineClamp: 3,
//     WebkitBoxOrient: 'vertical',
//     fontFamily: `Greycliff CF, ${theme.fontFamily}`,
//     maxHeight: '4.5em',
//     lineHeight: '1.3em',
//     marginTop: '0.5rem',
//   },

//   like: {
//     color: theme.colors.red[6],
//   },

//   item: {
//     width: '100%',
//   },

//   section: {
//     height: '18rem',
//     cursor: 'pointer',
//   },

//   footer: {
//     padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
//     marginTop: theme.spacing.md,
//     borderTop: `${rem(1)} solid ${
//       theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
//     }`,
//   },
// }));

// export default function RoadmapRecommendation() {
//   const { classes } = useStyles();
//   // const navigate = useNavigate();
//   // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
//   const [currentPage, setCurrentPage] = useState('');
//   const [roadmapPage, setRoadmapPage] = useState(1);

//   const initialUrl = `${baseUrl}/roadmaps?page=${roadmapPage}&order-type=recent`;
//   const fetchUrl = async (url: RequestInfo | URL) => {
//     const response = await fetch(url);
//     return response.json();
//   };

//   const {
//     refetch,
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isLoading,
//     isError,
//     error,
//   } = useInfiniteQuery(
//     'roadmaps',
//     async ({ pageParam = initialUrl }) => fetchUrl(pageParam),
//     {
//       getNextPageParam: (lastPage) => {
//         if ((Boolean((lastPage?.next))) && lastPage.result.length !== 0) {
//           return lastPage.next;
//         }
//         return null;
//       },
//       enabled: roadmapPage === 1,
//     },
//   );

//   useEffect(() => {
//     setRoadmapPage(1);
//     void refetch();
//   }, [refetch]);

//   if (isLoading)
//     return (
//       <div className="loading" style={{ height: '100vh' }}>
//         {/* <Spinner /> */}
//         <h1 style={{ textAlign: 'center' }}>로드맵 가져오는 중</h1>
//       </div>
//     );
//   if (isError) return <div>Error! {(error as string).toString()}</div>;

//   return (
//     <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
//       <SimpleGrid
//         cols={4}
//         breakpoints={[
//           { maxWidth: 'sm', cols: 1 },
//           { maxWidth: 'md', cols: 2 },
//           { maxWidth: 'lg', cols: 3 },
//         ]}
//       >
//         {data?.pages?.map((pageData) => pageData.result.map((article: { id: SetStateAction<string>; thumbnailUrl: string | null | undefined; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; createdAt: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; member: { nickname: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; }; }, index: Key | null | undefined) => (
//                 <Card key={index} className={classes.card}>
//                   <Card.Section
//                     className={classes.section}
//                     onMouseOver={() => {
//                       setCurrentPage(article.id);
//                     }}
//                     // onClick={() => {
//                     //   (currentPage.length > 0) && navigate(`/roadmap/post/${currentPage}`);
//                     // }}
//                   >
//                     <Group>
//                       <div className={classes.item}>
//                         <BlurredImg
//                           className={`${isLoading ? 'before' : 'loaded'}`}
//                         >
//                           <Image
//                             className={`${isLoading ? 'before' : 'loaded'}`}
//                             src={article.thumbnailUrl}
//                             alt={`${article.title}.img`}
//                             height="10em"
//                           />
//                         </BlurredImg>
//                       </div>
//                     </Group>
//                     <Text fw={700} className={classes.title} mx={20}>
//                       {article.title}
//                     </Text>
//                     <Text fz="sm" className={classes.desc} mx={20}>
//                       {article.description}
//                     </Text>
//                   </Card.Section>
//                   <Text fz="xs" c="dimmed" mx={8}>
//                     {article.createdAt}
//                   </Text>
//                   <Card.Section className={classes.footer}>
//                     <Group>
//                       <Avatar radius="xl" color="blue">
//                         {article?.member?.nickname?.substring(0, 1)}
//                       </Avatar>

//                       <Text fz="sm" fw={600}>
//                         {article.member.nickname}
//                       </Text>
//                     </Group>
//                   </Card.Section>
//                 </Card>
//               )))}
//       </SimpleGrid>
//     </InfiniteScroll>
//   );
// }
