from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler
from django.utils.translation import gettext_lazy as _

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        response.data['status_code'] = response.status_code
        
        # Customize error messages
        if isinstance(exc, APIException):
            response.data['message'] = exc.detail
            response.data['error_type'] = type(exc).__name__
            
            # Remove default error code if it exists
            if 'detail' in response.data:
                del response.data['detail']

    return response

class CustomExceptionHandlerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response


class FileUploadSecurityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Verifica se é uma requisição de upload
        if request.method == 'POST' and 'file' in request.FILES:
            file = request.FILES['file']
            
            # Verifica tamanho máximo do arquivo (5MB)
            if file.size > 5242880:  # 5MB em bytes
                return JsonResponse({
                    'error': 'Arquivo muito grande. O tamanho máximo permitido é 5MB.'
                }, status=400)
            
            # Verifica tipo de arquivo permitido
            allowed_types = ['image/jpeg', 'image/png', 'image/gif']
            if file.content_type not in allowed_types:
                return JsonResponse({
                    'error': 'Tipo de arquivo não permitido. Apenas JPEG, PNG e GIF são aceitos.'
                }, status=400)

        response = self.get_response(request)
        return response
