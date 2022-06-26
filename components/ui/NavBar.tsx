import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UiContext } from '../../context';
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';

export const NavBar = () => {

  const { toggleSideMenu } = useContext(UiContext);

  const router = useRouter();
  const { pathname } = router;

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display={'flex'} alignItems="center">
            <Typography variant="h6">Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <NextLink href="/category/men" passHref>
            <Link>
              <Button color={pathname === '/category/men' ? 'primary' : 'info'}>
                Hombres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref>
            <Link>
              <Button
                color={pathname === '/category/women' ? 'primary' : 'info'}
              >
                Mujeres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kids" passHref>
            <Link>
              <Button color={pathname === '/category/kids' ? 'primary' : 'info'}>
                Niños
              </Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />

        <IconButton>
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref>
          <IconButton>
            <Badge badgeContent={2} color="secondary">
              <ShoppingCartOutlined />
            </Badge>
          </IconButton>
        </NextLink>

        <Button
          onClick={toggleSideMenu}
        >Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
