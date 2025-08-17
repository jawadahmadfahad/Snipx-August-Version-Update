from datetime import datetime
from models.support_ticket import SupportTicket
from bson.objectid import ObjectId
import logging

logger = logging.getLogger(__name__)

class SupportService:
    def __init__(self, db):
        self.db = db
        self.tickets = db.support_tickets

    def create_ticket(self, user_id, data):
        """Create a new support ticket"""
        try:
            ticket = SupportTicket(
                user_id=user_id,
                name=data.get('name'),
                email=data.get('email'),
                subject=data.get('subject'),
                description=data.get('description'),
                priority=data.get('priority', 'medium'),
                ticket_type=data.get('type', 'bug')
            )
            
            result = self.tickets.insert_one(ticket.to_dict())
            logger.info(f"Support ticket created with ID: {result.inserted_id}")
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"Error creating support ticket: {e}")
            raise ValueError(f"Failed to create support ticket: {str(e)}")

    def get_ticket(self, ticket_id):
        """Get a specific support ticket"""
        try:
            ticket_data = self.tickets.find_one({"_id": ObjectId(ticket_id)})
            if not ticket_data:
                return None
            return SupportTicket.from_dict(ticket_data)
        except Exception as e:
            logger.error(f"Error fetching support ticket: {e}")
            return None

    def get_user_tickets(self, user_id):
        """Get all tickets for a specific user"""
        try:
            tickets = self.tickets.find({"user_id": ObjectId(user_id)}).sort("created_at", -1)
            return [SupportTicket.from_dict(ticket).to_dict() for ticket in tickets]
        except Exception as e:
            logger.error(f"Error fetching user tickets: {e}")
            return []

    def get_all_tickets(self, status=None, priority=None):
        """Get all tickets (admin function)"""
        try:
            query = {}
            if status:
                query['status'] = status
            if priority:
                query['priority'] = priority
                
            tickets = self.tickets.find(query).sort("created_at", -1)
            return [SupportTicket.from_dict(ticket).to_dict() for ticket in tickets]
        except Exception as e:
            logger.error(f"Error fetching all tickets: {e}")
            return []

    def update_ticket_status(self, ticket_id, status, user_id=None):
        """Update ticket status"""
        try:
            update_data = {
                'status': status,
                'updated_at': datetime.utcnow()
            }
            
            query = {"_id": ObjectId(ticket_id)}
            if user_id:  # If user_id provided, ensure user owns the ticket
                query["user_id"] = ObjectId(user_id)
            
            result = self.tickets.update_one(query, {"$set": update_data})
            
            if result.modified_count == 0:
                raise ValueError("Ticket not found or unauthorized")
                
            return True
            
        except Exception as e:
            logger.error(f"Error updating ticket status: {e}")
            raise ValueError(f"Failed to update ticket: {str(e)}")

    def add_response(self, ticket_id, response, responder_type='admin'):
        """Add a response to a ticket"""
        try:
            response_data = {
                'message': response,
                'responder_type': responder_type,  # 'admin' or 'user'
                'timestamp': datetime.utcnow()
            }
            
            result = self.tickets.update_one(
                {"_id": ObjectId(ticket_id)},
                {
                    "$push": {"responses": response_data},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            
            if result.modified_count == 0:
                raise ValueError("Ticket not found")
                
            return True
            
        except Exception as e:
            logger.error(f"Error adding response to ticket: {e}")
            raise ValueError(f"Failed to add response: {str(e)}")

    def get_ticket_stats(self):
        """Get ticket statistics (admin function)"""
        try:
            pipeline = [
                {
                    "$group": {
                        "_id": "$status",
                        "count": {"$sum": 1}
                    }
                }
            ]
            
            stats = list(self.tickets.aggregate(pipeline))
            
            # Convert to dict format
            result = {
                'open': 0,
                'in_progress': 0,
                'resolved': 0,
                'closed': 0
            }
            
            for stat in stats:
                if stat['_id'] in result:
                    result[stat['_id']] = stat['count']
            
            result['total'] = sum(result.values())
            return result
            
        except Exception as e:
            logger.error(f"Error getting ticket stats: {e}")
            return {'open': 0, 'in_progress': 0, 'resolved': 0, 'closed': 0, 'total': 0}
