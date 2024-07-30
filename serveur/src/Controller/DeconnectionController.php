<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\User;
use App\Entity\UserLog;

class DeconnectionController extends AbstractController
{
    #[Route('/deconnection', name: 'app_deconnection', methods: ['POST'])]
    public function index(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $userId = $data['data'][0];
        $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $userId]);
        
        if($user){
            $userLog = new UserLog();
            $userLog->setUser($user);
            $userLog->setTime(new \DateTime());
            $userLog->setAction('deconnection');
            $entityManager->persist($userLog);
            $entityManager->flush();

            $user->setLastToken(null);
            $entityManager->persist($user);
            $entityManager->flush();

            return new JsonResponse(['status' => 'succés'], JsonResponse::HTTP_OK);
        }else{
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur est survenue'], JsonResponse::HTTP_BAD_REQUEST);
        }
    }
}
