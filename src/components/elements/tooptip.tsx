import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from "@mui/material/styles";

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#fff',
        color: '#000'
    },
}));