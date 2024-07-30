<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\User;
use App\Entity\UserLog;

class SuppressionController extends AbstractController
{
    #[Route('/suppression', name: 'app_suppression', methods: ['POST'])]
    public function catchData(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);


        // $userId = 1;

        $user = $entityManager->getRepository(User::class)->find($data['data'][0]);
        
        if ($user) {
            $userLogs = $entityManager->getRepository(UserLog::class)->findBy(['user' => $user]);

            foreach ($userLogs as $userLog) {
                $entityManager->remove($userLog);
            }

            $entityManager->remove($user);
            $entityManager->flush();

            return new JsonResponse(['status' => 'success', 'data' => 'ok'], JsonResponse::HTTP_OK);
        } else {
            return new JsonResponse(['error' => 'Aucun user'], JsonResponse::HTTP_NOT_FOUND);
        }
    }
}
