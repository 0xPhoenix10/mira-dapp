import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from "@mui/material/styles";

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: '#000',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#000',
        color: 'lightgrey',
        fontSize: '13px',
        textAlign: 'center',
        padding: '10px'
    },
}));