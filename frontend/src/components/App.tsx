import { AppShell } from "@mantine/core";
import { useDisclosure, useFullscreenDocument, useMediaQuery } from "@mantine/hooks";
import { useEffect } from "react";
import { DetailsBar } from "@/components/DetailsBar/DetailsBar.tsx";
import { Footer } from "@/components/Footer/Footer.tsx";
import { GraphView } from "@/components/GraphView/GraphView.tsx";
import { Header } from "@/components/Header/Header.tsx";
import { ImportDialog } from "@/components/ImportDialog/ImportDialog.tsx";
import { Navbar } from "@/components/Navbar/Navbar.tsx";

const HEADER_HEIGHT = 46;
const FOOTER_HEIGHT = 32;
const MOBILE_SIDEBAR_QUERY = "(max-width: 47.99em)";

export function App() {
    const { fullscreen, toggle: toggleFullscreen } = useFullscreenDocument();
    const mobile = useMediaQuery(MOBILE_SIDEBAR_QUERY);
    const [navbarOpened, { toggle: toggleNavbar, close: closeNavbar }] = useDisclosure(true);
    const [asideOpened, { toggle: toggleAside, close: closeAside }] = useDisclosure(true);

    function handleNavbarToggle() {
        if (mobile && !navbarOpened) {
            closeAside();
        }
        toggleNavbar();
    }

    function handleAsideToggle() {
        if (mobile && !asideOpened) {
            closeNavbar();
        }
        toggleAside();
    }

    useEffect(() => {
        if (mobile && navbarOpened && asideOpened) {
            closeAside();
        }
    }, [asideOpened, closeAside, mobile, navbarOpened]);

    useEffect(() => {
        if (fullscreen) {
            closeNavbar();
            closeAside();
        }
    }, [closeAside, closeNavbar, fullscreen]);

    return (
        <>
            <ImportDialog />
            <AppShell
                data-testid="application-shell"
                header={{
                    height: HEADER_HEIGHT,
                }}
                navbar={{
                    width: 300,
                    breakpoint: "sm",
                    collapsed: {
                        mobile: !navbarOpened,
                        desktop: !navbarOpened,
                    },
                }}
                aside={{
                    width: 400,
                    breakpoint: "sm",
                    collapsed: {
                        mobile: !asideOpened,
                        desktop: !asideOpened,
                    },
                }}
                footer={{
                    height: FOOTER_HEIGHT,
                    collapsed: fullscreen,
                }}
            >
                <AppShell.Header data-testid="application-header">
                    <Header
                        navbarOpened={navbarOpened}
                        toggleNavbar={handleNavbarToggle}
                        asideOpened={asideOpened}
                        toggleAside={handleAsideToggle}
                        fullscreen={fullscreen}
                        toggleFullscreen={toggleFullscreen}
                    />
                </AppShell.Header>
                <AppShell.Navbar data-testid="navigation-sidebar">
                    <Navbar />
                </AppShell.Navbar>
                <AppShell.Main data-testid="graph-main">
                    <GraphView />
                </AppShell.Main>
                <AppShell.Aside data-testid="details-sidebar">
                    <DetailsBar />
                </AppShell.Aside>
                <AppShell.Footer data-testid="application-footer">
                    <Footer />
                </AppShell.Footer>
            </AppShell>
        </>
    );
}
