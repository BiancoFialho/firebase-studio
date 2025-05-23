"use client"

import * as React from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import * as Accordion from "@radix-ui/react-accordion"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, Layout, PanelLeft } from "lucide-react"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"



const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
// Adjusted widths based on feedback for better proportion
const BASE_UNIT = 56 // Approx width for icon-only state (adjust as needed) - e.g., 3.5rem
const EXPANDED_RATIO = 4 // Adjust multiplier for desired width (e.g., 4 * 56 = 224px)
const SIDEBAR_WIDTH_ICON = `${BASE_UNIT}px`
// const SIDEBAR_WIDTH = `${Math.round(BASE_UNIT * EXPANDED_RATIO)}px` // e.g., ~252px
const SIDEBAR_WIDTH = `${Math.round(BASE_UNIT * EXPANDED_RATIO)}px`

const SIDEBAR_WIDTH_MOBILE = "240px" // Keep a fixed reasonable mobile width

// --- Context Setup ---
type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  isSheetOpen: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [isSheetOpen, setOpenMobile] = React.useState(false)
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open

    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])


    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        isSheetOpen,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, isSheetOpen, setOpenMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH, // Use variable
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

// --- Main Sidebar Component ---
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "icon",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, isSheetOpen, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-screen w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
            className
          )}
          ref={ref}
          {...props}
        >
          <div className="border-b px-3 py-2">
          <Button variant="ghost" className="size-8"><Layout/></Button>
          </div>
          {children}
        </div> 
      )
    }

    if (isMobile) {
      return (
        <Sheet open={isSheetOpen} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            open={isSheetOpen}
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground border-r border-sidebar-border h-screen [&>button]:hidden"
            style={{
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          </SheetContent>
        </Sheet>
    }

    // Desktop Sidebar
    return (
      <div
        ref={ref}
        className={cn("group peer hidden md:block text-sidebar-foreground", className)}
        data-state={state} 
        data-collapsible={state === "collapsed" ? collapsible : undefined}
        data-variant={variant}
        data-side={side}
      >
        {/* Sidebar Gap */}
        <div
          className={cn(
            "relative h-screen transition-[width] duration-300 ease-in-out",
            "w-[var(--sidebar-width)]",
            "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
          )}
        />
        {/* Fixed Sidebar Container */}
        <div
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-300 ease-in-out md:flex",
            "w-[var(--sidebar-width)]",
            side === "left"
              ? "left-0 border-r border-sidebar-border"
              : "right-0 border-l border-sidebar-border",
            "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]",
            variant === "floating" && "m-2 rounded-lg shadow-lg border border-sidebar-border"
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className={cn("flex h-full w-full flex-col bg-sidebar",
              variant === "floating" && "rounded-lg",
            )}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

// --- Sidebar Trigger ---
const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      className={cn("h-8 w-8 hover:bg-sidebar-accent", className)}
      onClick={(event) => {
        onClick?.(event)
        
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

// --- Sidebar Inset (Main Content Area) ---
const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background transition-[margin-left,margin-right] duration-300 ease-in-out",
        "md:peer-data-[side=left]:peer-data-[state=expanded]:ml-[var(--sidebar-width)]  md:p-5 p-3",
        "md:peer-data-[side=left]:peer-data-[state=collapsed]:peer-data-[collapsible=icon]:ml-[var(--sidebar-width-icon)]",
        "md:peer-data-[side=right]:peer-data-[state=expanded]:mr-[var(--sidebar-width)]",
        "md:peer-data-[side=right]:peer-data-[state=collapsed]:peer-data-[collapsible=icon]:mr-[var(--sidebar-width-icon)]",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

// --- Basic Sidebar Sections ---
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex items-center gap-2 p-3", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-3 ", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-2 py-1.5",
        "group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1.5 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-1.5",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

// --- Menu Components ---
const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn(
        "flex w-full min-w-0 flex-col",
        className)}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
    "peer/menu-button group/button flex w-full items-center justify-start gap-2.5 overflow-hidden rounded-md px-2.5 py-2 text-left text-sm font-medium outline-none ring-sidebar-ring transition-colors  focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground [&>svg:first-child]:size-4 [&>svg:first-child]:shrink-0 [&>svg:first-child]:text-sidebar-foreground/70 [&>svg:first-child]:group-data-[active=true]/button:text-sidebar-accent-foreground group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0 [&>svg:first-child]:group-data-[collapsible=icon]:size-5 group-data-[collapsible=icon]:text-transparent",
    {
        variants: {
            variant: {
                default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            },
            size: {
                default: "h-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        },
    }
);

const SidebarMenuButton = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
    isSubmenuTrigger?: boolean
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant,
      size,
      tooltip,
      className,
      children,
      isSubmenuTrigger = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();
    const buttonContent = (
      <>
        {children}
         {isSubmenuTrigger && state === 'expanded' && (
              <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[collapsible=icon]:hidden " />
         )}
         {isSubmenuTrigger && state === 'collapsed' && (
              <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[collapsible=icon]:hidden " />
         )}
      </>
    );

    const buttonElement = (
      <Comp
        ref={ref as any}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size, className }))}
        {...(Comp === "button" && !asChild && { type: "button" })}
        {...props}
      >
        {buttonContent}
      </Comp>
    );

    if (!tooltip) {
      return buttonElement;
    }

    let tooltipProps: React.ComponentProps<typeof TooltipContent> = {};
    if (typeof tooltip === "string") {
      tooltipProps = { children: <span className="text-xs">{tooltip}</span> };
    } else {
      tooltipProps = tooltip;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
            {buttonElement}
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="start"
          sideOffset={8} // Increased offset
          hidden={state !== "collapsed" && !isMobile}
          className="bg-sidebar text-sidebar-foreground border-sidebar-border px-2 py-1 text-xs " // Use sidebar colors, smaller text
          {...tooltipProps}
        />
      </Tooltip> 
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";


// --- Submenu Components (Using Radix Accordion) ---
const SidebarSubmenu = React.forwardRef<
  React.ElementRef<typeof Accordion.Root>,
  React.ComponentPropsWithoutRef<typeof Accordion.Root> & {
    value?: string;
    onValueChange?: (value: string) => void;
  }
>(({ className, value, onValueChange, ...props }, ref) => (
  <Accordion.Root
      ref={ref}
    type="multiple"
    collapsible
    className={cn("w-full group-data-[collapsible=icon]:hidden", className)} // Hide submenu in icon mode
    value={value}
    onValueChange={onValueChange}
    {...props}
  />
));
SidebarSubmenu.displayName = "SidebarSubmenu";

const SidebarSubmenuItem = React.forwardRef<
    React.ElementRef<typeof Accordion.Item>,
    React.ComponentPropsWithoutRef<typeof Accordion.Item>
>(({ className, ...props }, ref) => (
    <Accordion.Item
        ref={ref}
      className={cn("border-none group/submenu-item", className)} // Remove border, add group identifier
      {...props}
    />
));
SidebarSubmenuItem.displayName = "SidebarSubmenuItem"


const SidebarSubmenuTrigger = React.forwardRef<
  React.ElementRef<typeof Accordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof Accordion.Trigger> & {
      tooltip?: string | React.ComponentProps<typeof TooltipContent>;
      isActive?: boolean;
  }
>(({ className, children, tooltip, isActive, ...props }, ref) => (
      <Accordion.Header className="flex ">
         <Accordion.Trigger asChild>
              <SidebarMenuButton
                 ref={ref} 
                 className={cn("w-full justify-start group", className)} // Ensure justification starts left
                 isActive={isActive}
                 tooltip={tooltip}
                 isSubmenuTrigger={true} // Mark this as a submenu trigger
                 {...props}
              >
                 {children}
                 
               </SidebarMenuButton>
           </Accordion.Trigger>
      </Accordion.Header>
));
SidebarSubmenuTrigger.displayName = "SidebarSubmenuTrigger";


const SidebarSubmenuContent = React.forwardRef<
  React.ElementRef<typeof Accordion.Content>,
  React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ className, children, ...props }, ref) => (
  <Accordion.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className 
    )}
    {...props}
  > 
    <div className="py-0 pl-8 pr-1 ">
        <SidebarMenu className="gap-0"> {/* Consistent gap for submenu */}
           {children}
        </SidebarMenu>
    </div>
  </Accordion.Content>
));
SidebarSubmenuContent.displayName = "SidebarSubmenuContent";


// --- Other Components (Keep as before or adjust styling) ---
const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-sidebar-accent shadow-none focus-visible:ring-1 focus-visible:ring-sidebar-ring text-xs ",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 my-1.5 w-auto bg-sidebar-border/50 ", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"


export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  SidebarSubmenu,
  SidebarSubmenuItem,
  SidebarSubmenuTrigger,
  SidebarSubmenuContent,
  useSidebar,
}

    