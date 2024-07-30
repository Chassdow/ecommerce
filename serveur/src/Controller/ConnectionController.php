<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\User;
use App\Entity\UserLog;

class ConnectionController extends AbstractController
{
    #[Route('/connection', name: 'app_connection')]
    public function index(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, TokenGeneratorInterface $tokenGenerator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        // dd($user);
        if($user && $passwordHasher->isPasswordValid($user, $data['password'])){
            $userId = $user->getId();
            $userFirstname = $user->getFirstname();
            $userLastname = $user->getLastname();
            $userEmail = $user->getEmail();
            // dd($userId);

            $userLog = new UserLog();
            $userLog->setUser($user);
            $userLog->setTime(new \DateTime());
            $userLog->setAction('connection');
            $entityManager->persist($userLog);
            $entityManager->flush();

            $user->setLastToken(new \DateTime());
            $entityManager->persist($user);
            $entityManager->flush();

            return new JsonResponse(['status' => 'success', 'data' => [$userId,$userFirstname,$userLastname,$userEmail,$user->getRoles()]], JsonResponse::HTTP_OK);
        }else{
            return new JsonResponse(['status' => 'error'], JsonResponse::HTTP_BAD_REQUEST);            
        }
    }
}
