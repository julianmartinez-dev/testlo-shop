import { Box, Typography } from '@mui/material';
import Head from 'next/head';
import { FC } from 'react';
import { AdminNavBar } from '../admin';
import { SideMenu } from '../ui';

interface Props {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
  children: React.ReactNode;
  icon?: JSX.Element;
  subtitle: string;
}

export const AdminLayout: FC<Props> = ({
  children,
  title,
  pageDescription,
  imageFullUrl,
  subtitle,
  icon,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <meta name="og:description" content={pageDescription} />
        {imageFullUrl && <meta property="og:image" content={imageFullUrl} />}
      </Head>
      <nav>
        <AdminNavBar />
      </nav>
      <SideMenu />
      <main
        style={{
          margin: '80px auto',
          maxWidth: '1440px',
          padding: '0px 30px',
        }}
      >
        <Box display="flex" flexDirection={'column'}>
          <Typography variant="h1" component="h1" display={'flex'} alignItems="center" gap={1}>
            {icon} {title}
          </Typography>
          <Typography variant="h2" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        </Box>
        <Box className="fadeIn">{children}</Box>
      </main>
      <footer>{/* footer */}</footer>
    </>
  );
};
