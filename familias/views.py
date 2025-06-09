from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Familia
from .serializers import FamiliaSerializer
from membros.models import Membro
from membros.serializers import MembroSerializer

class FamiliaViewSet(viewsets.ModelViewSet):
    queryset = Familia.objects.all()
    serializer_class = FamiliaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        membros_data = request.data.pop('membros', [])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        familia = serializer.save()
        
        # Create membros for the familia
        for membro_data in membros_data:
            membro_data['familia'] = familia.id
            membro_serializer = MembroSerializer(data=membro_data)
            if membro_serializer.is_valid():
                membro_serializer.save()
            else:
                return Response(membro_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        membros_data = request.data.pop('membros', [])
        
        # Update existing membros
        for membro_data in membros_data:
            membro_id = membro_data.get('id')
            if membro_id:
                try:
                    membro = Membro.objects.get(id=membro_id, familia=instance)
                    membro_serializer = MembroSerializer(membro, data=membro_data)
                    if membro_serializer.is_valid():
                        membro_serializer.save()
                    else:
                        return Response(membro_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                except Membro.DoesNotExist:
                    continue
            else:
                membro_data['familia'] = instance.id
                membro_serializer = MembroSerializer(data=membro_data)
                if membro_serializer.is_valid():
                    membro_serializer.save()
                else:
                    return Response(membro_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        membros = Membro.objects.filter(familia=instance)
        membro_serializer = MembroSerializer(membros, many=True)
        
        response_data = serializer.data
        response_data['membros'] = membro_serializer.data
        return Response(response_data)
