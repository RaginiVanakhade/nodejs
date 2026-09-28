import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material"

import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"


const priorityStyles = {
  HIGH: { bg: "#fee2e2", color: "#b91c1c" },     
  MEDIUM: { bg: "#fef3c7", color: "#b45309" },   
  LOW: { bg: "#d1fae5", color: "#047857" },      
  default: { bg: "#f1f5f9", color: "#334155" }, 
}

const statusStyles = {
  CLOSED: { bg: "#d1fae5", color: "#047857" },  
  OPEN: { bg: "#e0e7ff", color: "#4338ca" },     
  default: { bg: "#f1f5f9", color: "#334155" },  
}

const TicketTable = ({ tickets = [], isAdmin = false, onEdit, onDelete, onView }) => {
  if (!tickets.length) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="body1" sx={{ color: "#475569" }}>
          No tickets to display.
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer
      sx={{
        borderRadius: "16px",
        border: "1px solid #e2e8f0", 
        overflowX: "auto",
      }}
    >
      <Table sx={{ minWidth: 700 }} aria-label="tickets table">
     
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#f8fafc",        
              borderBottom: "1px solid #e2e8f0", 
            }}
          >
            {isAdmin && (
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                User
              </TableCell>
            )}
            <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
              Software Name
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
              Priority
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
              Category
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
              Comment
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: 700, color: "#475569" }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>

      
        <TableBody>
          {tickets.map((ticket) => {
            const pStyle = priorityStyles[ticket.priority] || priorityStyles.default
            const sStyle = statusStyles[ticket.status] || statusStyles.default

            return (
              <TableRow
                key={ticket._id}
                sx={{
                  borderBottom: "1px solid #e2e8f0",
                  "&:hover": { backgroundColor: "#f8fafc" },
                  "&:last-child td": { borderBottom: 0 },
                }}
              >
                {isAdmin && (
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#0f172a" }} // slate-900
                    >
                      {ticket.createdBy?.name || "Unknown user"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", fontSize: "0.75rem" }} // slate-500
                    >
                      {ticket.createdBy?.email || "N/A"}
                    </Typography>
                  </TableCell>
                )}

                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#0f172a" }}
                  >
                    {ticket.softwareName || "Ticket"}
                  </Typography>
                </TableCell>

                {/* Priority Chip — तुझेच colors */}
                <TableCell>
                  <Chip
                    label={ticket.priority || "Normal"}
                    size="small"
                    sx={{
                      backgroundColor: pStyle.bg,
                      color: pStyle.color,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      borderRadius: "9999px",
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ color: "#334155" }}>
                    {ticket.category || "General"}
                  </Typography>
                </TableCell>

           
                <TableCell>
                  <Chip
                    label={ticket.status || "OPEN"}
                    size="small"
                    sx={{
                      backgroundColor: sStyle.bg,
                      color: sStyle.color,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      borderRadius: "9999px",
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#475569",
                      maxWidth: 240,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={ticket.softwareIssueComment || "No comment"}
                  >
                    {ticket.softwareIssueComment || "No comment"}
                  </Typography>
                </TableCell>

           
                <TableCell align="center">
                  {isAdmin ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onView?.(ticket)}
                      sx={{
                        backgroundColor: "#e2e8f0",  
                        color: "#334155",         
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        borderRadius: "8px",
                        px: 1.5,
                        py: 0.5,
                        boxShadow: "none",
                        "&:hover": {
                          backgroundColor: "#cbd5e1",
                          boxShadow: "none",
                        },
                      }}
                    >
                      View
                    </Button>
                  ) : (
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {ticket.status !== "CLOSED" && (
                        <>
                          <Tooltip title="Edit ticket">
                            <IconButton
                              size="small"
                              onClick={() => onEdit?.(ticket)}
                              sx={{
                                backgroundColor: "#eef2ff",       
                                border: "1px solid #c7d2fe",     
                                borderRadius: "12px",
                                color: "#4338ca",              
                                px: 1,
                                py: 0.75,
                                "&:hover": {
                                  backgroundColor: "#e0e7ff",    
                                },
                              }}
                            >
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete ticket">
                            <IconButton
                              size="small"
                              onClick={() => onDelete?.(ticket._id)}
                              sx={{
                                backgroundColor: "#fef2f2",   
                                border: "1px solid #fecaca",    
                                borderRadius: "12px",
                                color: "#b91c1c",             
                                px: 1,
                                py: 0.75,
                                "&:hover": {
                                  backgroundColor: "#fee2e2",    
                                },
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Stack>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TicketTable